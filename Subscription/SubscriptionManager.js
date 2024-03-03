class SubscriptionManager {

      /**
       * @Subscribers
       */
      #subscribers = [];
      get subscribers() {return this.#subscribers;}
      #dataToPushToSubscribers = {
            parent: null,
            data: null
      };
      set dataToPushToSubscribers(info) {this.#dataToPushToSubscribers = info;}

      /**
       * @Subscription
       */
      #subscriptions = [];
      get subscriptions() {return this.#subscriptions;};

      constructor() { }

      UpdateFromChange() { }

      /**
       * @Subscription
       */

      SubscribeTo(parent) {
            console.table("%cSUBSCRIPTION MANAGER.JS", "background-color:" + COLOUR.Orange + ";color:white;font-weight:bold;", this.ID, " issues Subscription request to ", parent.ID);

            this.#subscriptions.push(parent);

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
            console.table("%cSUBSCRIPTION MANAGER.JS", "background-color:" + COLOUR.Orange + ";color:white;font-weight:bold;", this.ID, "has recieved data", data);
            if(data.parent == null) return;
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
            console.table("%cSUBSCRIPTION MANAGER.JS", "background-color:" + COLOUR.Orange + ";color:white;font-weight:bold;", this.ID, " issues UnSubscribe request to ", parent.ID);

            for(let i = 0; i < this.#subscriptions.length; i++) {
                  if(this.#subscriptions[i].ID == parent.ID) {
                        this.#subscriptions[i].RemoveSubscriber(this);//parent remove me
                        this.#subscriptions.splice(i, 1);//I remove parent
                  }
            }

            parent.UpdateFromChange();
            this.UpdateFromChange();
      }

      /**
       * @Subscribers
       */
      AddSubscriber(subscriber) {
            console.table("%cSUBSCRIPTION MANAGER.JS", "background-color:" + COLOUR.Orange + ";color:white;font-weight:bold;", this.ID, " adds Subscriber ", subscriber.ID);
            this.#subscribers.push(subscriber);
      }

      PushToSubscribers() {
            console.table("%cSUBSCRIPTION MANAGER.JS", "background-color:" + COLOUR.Orange + ";color:white;font-weight:bold;", this.ID, " sends data to x" + this.#subscribers.length + " Subscribers, data: ", this.#dataToPushToSubscribers);
            for(let i = 0; i < this.#subscribers.length; i++) {
                  this.#subscribers[i].ReceiveSubscriptionData(this.#dataToPushToSubscribers);
            }
      }

      RemoveSubscriber(subscriber) {
            console.table("%cSUBSCRIPTION MANAGER.JS", "background-color:" + COLOUR.Orange + ";color:white;font-weight:bold;", this.ID, " removes Subscriber ", subscriber.ID);
            for(let i = 0; i < this.#subscribers.length; i++) {
                  if(this.#subscribers[i] == subscriber) {
                        this.#subscribers.splice(i, 1);//I remove subscriber
                        break;
                  }
            }
      }

      /**
       * @DeleteThis
       */
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