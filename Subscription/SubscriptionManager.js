class SubscriptionManager {

      ///Subscribers
      #subscribers = [];
      get subscribers() {return this.#subscribers;}

      DATA_FOR_SUBSCRIBERS = {
            parent: null,
            data: null
      };

      ///Subscription
      #subscriptions = [];
      get subscriptions() {return this.#subscriptions;};
      INHERITED_DATA = [];
      /*overrideable*/get Type() {return "SubscriptionManager";}
      /*overrideable*/UpdateFromChange() { }


      ///Subscriptions

      SubscribeTo(parent) {
            console.table("%cSUBSCRIPTION MANAGER.JS", "background-color:" + COLOUR.Orange + ";color:white;font-weight:bold;", this.Type, " issues Subscription request to ", parent.ID);

            if(!this.isSubscribedTo(parent)) this.#subscriptions.push(parent);

            if(!parent.AddSubscriber) return new Error("parent does not contain AddSubscriber method");
            parent.AddSubscriber(this);
            parent.PushToSubscribers();
            this.UpdateFromChange();

      }

      isSubscribedTo(parent) {
            if(this.subscriptions.includes(parent)) return true;
            return false;
      }

      ReceiveSubscriptionData(data) {
            if(data.parent == null) return;

            console.table("%cSUBSCRIPTION MANAGER.JS", "background-color:" + COLOUR.Orange + ";color:white;font-weight:bold;", this.Type, "has recieved data", data);

            //:Only update subscriptions for relevant parent so that others are not erased

            let dataIsNew = true;

            for(let i = 0; i < this.INHERITED_DATA.length; i++) {
                  if(data.parent == this.INHERITED_DATA[i].parent) {
                        dataIsNew = false;

                        this.INHERITED_DATA[i] = data;
                        break;
                  }
            }

            if(dataIsNew) {
                  this.INHERITED_DATA.push(data);
            }

            //:Add Parent to subscriptions if is new

            let dataFromNewParent = true;
            for(let i = 0; i < this.#subscriptions.length; i++) {
                  if(this.#subscriptions[i].ID == data.parent.ID) {
                        dataFromNewParent = false;
                        this.#subscriptions[i] = data.parent;
                        break;
                  }
            }
            if(dataFromNewParent) this.#subscriptions.push(data.parent);

            this.UpdateFromChange();
      }

      UnSubscribeFrom(parent) {
            console.table("%cSUBSCRIPTION MANAGER.JS", "background-color:" + COLOUR.Orange + ";color:white;font-weight:bold;", this.Type, " issues UnSubscribe request to ", parent.ID);

            //:Remove Parent data from my subscriptions
            for(let i = 0; i < this.INHERITED_DATA.length; i++) {
                  if(this.INHERITED_DATA[i].parent == parent) {
                        this.INHERITED_DATA.splice(i, 1);
                        break;
                  }
            }

            //:Parent<->Me remove each other
            for(let i = 0; i < this.#subscriptions.length; i++) {
                  if(this.#subscriptions[i].ID == parent.ID) {
                        this.#subscriptions[i].RemoveSubscriber(this);//parent remove me
                        this.#subscriptions.splice(i, 1);//I remove parent
                  }
            }

            if(parent.UpdateFromChange) parent.UpdateFromChange();
            this.UpdateFromChange();
      }

      ///Subscribers

      AddSubscriber(subscriber) {
            console.table("%cSUBSCRIPTION MANAGER.JS", "background-color:" + COLOUR.Orange + ";color:white;font-weight:bold;", this.Type, " adds Subscriber ", subscriber.ID);
            this.#subscribers.push(subscriber);
      }

      PushToSubscribers() {
            console.table("%cSUBSCRIPTION MANAGER.JS", "background-color:" + COLOUR.Orange + ";color:white;font-weight:bold;", this.Type, " sends data to x" + this.#subscribers.length + " Subscribers, data: ", this.DATA_FOR_SUBSCRIBERS);
            for(let i = 0; i < this.#subscribers.length; i++) {
                  this.#subscribers[i].ReceiveSubscriptionData(this.DATA_FOR_SUBSCRIBERS);
            }
      }

      RemoveSubscriber(subscriber) {
            console.table("%cSUBSCRIPTION MANAGER.JS", "background-color:" + COLOUR.Orange + ";color:white;font-weight:bold;", this.Type, " removes Subscriber ", subscriber.ID);
            for(let i = 0; i < this.#subscribers.length; i++) {
                  if(this.#subscribers[i] == subscriber) {
                        this.#subscribers.splice(i, 1);//I remove subscriber
                        break;
                  }
            }
      }

      ///Delete all subscriptions, parent<->me and me<->subscribers

      Delete() {
            console.table("%cSUBSCRIPTION MANAGER.JS", "background-color:" + COLOUR.Orange + ";color:white;font-weight:bold;", "Delete called SubscriptionManager", this.subscriptions.length);

            //subscribers remove me, and I remove them
            while(this.subscribers.length > 0) {
                  this.subscribers[0].UnSubscribeFrom(this);
            }

            //I remove my subscriptions, and parents remove me
            while(this.subscriptions.length > 0) {
                  this.UnSubscribeFrom(this.subscriptions[0]);
            }
      }
}