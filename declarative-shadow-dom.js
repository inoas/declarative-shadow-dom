customElements.define('declarative-shadow-dom', class extends HTMLTemplateElement {
    static get observedAttributes() {
        return ['auto-stamp', 'stamped', 'disabled'];
    }

    constructor(self) {
        // assignment required by polyfill
        self = super(self);
        console.info('constructor', this.content, this.parentElement);

        // this.appendToParentsShadowRoot();
    }
    connectedCallback(){
        // debugger
    console.info('connectedCallback', this.content, this.parentElement);
        // if(this.hasAttribute('auto-stamp')){
        //     this.appendToParentsShadowRoot();
        // }
        // debugger
        if(!this.hasAttribute('disabled')){
            this.setAttribute('stamped', ''); // this.clear();
        }
    }
    disconnectedCallback(){
    console.info('disconnectedCallback', this.content, this.parentElement);
        this.removeAttribute('stamped'); // this.clear();
    }
    attributeChangedCallback(name, oldVal, newVal){
    console.info('attributeChangedCallback', this.content, this.parentElement, this.isConnected, name, oldVal, newVal);
        switch(name){
            case 'disabled':
                if(this.hasAttribute('disabled')){
                    // this.clear();
                } else {
                    if(this.isConnected){
                        this.appendToParentsShadowRoot();
                    }
                }
                break;
            case 'stamped':
                if(this.hasAttribute('stamped')){
                    if(!this.hasAttribute('disabled')){
                        this.appendToParentsShadowRoot();
                    }
                } else {
                    this.clear();
                }
                break;
        }
    }
    appendToParentsShadowRoot(){
        console.info('stamping dsd');
        const parentElement = this.parentElement;
        if(!parentElement){
            throw 'declarative-shadow-dom needs a perentElement to stamp to';
        }
        if(!parentElement.shadowRoot){
            parentElement.attachShadow({mode: 'open'});
        }
        let fragment = document.importNode(this.content, true);
        this.stampedNodes = Array.prototype.slice.call(fragment.childNodes);
        parentElement.shadowRoot.appendChild(fragment);
        debugger
        ShadyCSS && ShadyCSS.styleElement(parentElement);
        parentElement.dispatchEvent(new CustomEvent('declarative-shadow-dom-stamped', {detail: {stampedNodes: this.stampedNodes}}));
        this.setAttribute('stamped', '');
    }
    clear(){
        console.info('clearing dsd');
        if(this.stampedNodes){
            let node;
            while(node = this.stampedNodes.pop()){
                node.parentNode && node.parentNode.removeChild(node);
            }
        }
    }
}, {
    extends: 'template'
});
