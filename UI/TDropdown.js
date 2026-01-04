class TDropdown {
      constructor({label, options, defaultValue = '', parent, onChange}) {
            this.options = [{label: '— None —', value: '', img: ''}, ...options];
            this.defaultValue = defaultValue;
            this.onChange = onChange;

            this.wrapper = document.createElement('div');
            this.wrapper.className = 'TDropdown-wrapper';

            this.display = document.createElement('div');
            this.display.className = 'TDropdown-display';
            this.display.tabIndex = 0;

            this.label = document.createElement('label');
            this.label.className = 'TDropdown-label';
            this.label.innerText = label;

            this.arrow = document.createElement('div');
            this.arrow.className = 'TDropdown-arrow';
            this.arrow.innerHTML = '&#9660;';

            this.resetBtn = document.createElement('div');
            this.resetBtn.className = 'TDropdown-reset';
            this.resetBtn.innerHTML = '&#8634;';

            this.list = document.createElement('div');
            this.list.className = 'TDropdown-list';
            this.list.style.display = 'none';

            this.searchInput = document.createElement('input');
            this.searchInput.className = 'TDropdown-search';
            this.searchInput.placeholder = 'Search...';
            this.list.appendChild(this.searchInput);

            this.itemContainer = document.createElement('div');
            this.list.appendChild(this.itemContainer);

            this.filteredOptions = [...this.options];
            this.renderOptions();

            this.searchInput.addEventListener('input', () => {
                  const term = this.searchInput.value.toLowerCase();
                  this.filteredOptions = this.options.filter(o =>
                        o.label.toLowerCase().includes(term)
                  );
                  this.renderOptions();
            });

            this.display.addEventListener('click', () => this.toggle());
            this.resetBtn.addEventListener('click', () => this.setValue(this.defaultValue));

            document.addEventListener('click', e => {
                  if(!this.wrapper.contains(e.target)) this.close();
            });

            this.wrapper.appendChild(this.display);
            this.wrapper.appendChild(this.label);
            this.wrapper.appendChild(this.arrow);
            this.wrapper.appendChild(this.resetBtn);
            this.wrapper.appendChild(this.list);
            if(parent) parent.appendChild(this.wrapper);

            this.setValue(this.defaultValue);
      }

      renderOptions() {
            this.itemContainer.innerHTML = '';
            this.filteredOptions.forEach(opt => {
                  const item = document.createElement('div');
                  item.className = 'TDropdown-item';
                  item.dataset.value = opt.value;

                  if(opt.img) {
                        const img = document.createElement('img');
                        img.src = opt.img;
                        item.appendChild(img);
                  }

                  const text = document.createElement('span');
                  text.innerText = opt.label;
                  item.appendChild(text);

                  item.addEventListener('click', () => {
                        this.setValue(opt.value);
                        this.close();
                  });

                  this.itemContainer.appendChild(item);
            });
      }

      toggle() {
            this.list.style.display === 'block' ? this.close() : this.open();
      }

      open() {
            this.list.style.display = 'block';
            this.wrapper.classList.add('open');
            this.searchInput.focus();
      }

      close() {
            this.list.style.display = 'none';
            this.wrapper.classList.remove('open');
            this.searchInput.value = '';
            this.filteredOptions = [...this.options];
            this.renderOptions();
      }

      setValue(val) {
            const option = this.options.find(o => o.value === val);
            if(!option) return;

            this.display.innerHTML = '';

            if(option.img) {
                  const img = document.createElement('img');
                  img.src = option.img;
                  img.style.width = '20px';
                  img.style.height = '20px';
                  img.style.objectFit = 'contain';
                  this.display.appendChild(img);
            }

            const text = document.createElement('span');
            text.innerText = option.label;
            text.className = "TDropdown-text";
            this.display.appendChild(text);
            text.classList.toggle('noneSelected', val === '');

            this.display.appendChild(this.arrow);
            this.display.appendChild(this.resetBtn);

            this.selectedValue = val;
            this.wrapper.classList.toggle('dropdownSelected', val !== '');


            this.resetBtn.style.display = val !== this.defaultValue ? 'block' : 'none';

            if(this.onChange) this.onChange(val);
      }

      getValue() {
            return this.selectedValue;
      }

      get element() {
            return this.wrapper;
      }
}
