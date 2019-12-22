// variables

const cartBtn= document.querySelector(".cart-btn");
const closeCartBtn= document.querySelector(".close-cart");
const clearcartBtn= document.querySelector(".clear-cart");
const cartDOM= document.querySelector(".cart");
const cartOverlay= document.querySelector(".cart-overlay");
const cartItems= document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent= document.querySelector(".cart-content");
const productsDOM= document.querySelector
(".products-center");






// cart items storage (array)

let cart= [];


//button 
//empty array
let buttonsDOM = [];

//getting the products

class Products{
    async getProducts(){
               
        try {
            //hold alt key to move this out of the tryncatch       
            let result = await fetch('products.json');
            let data= await result.json();
            
            //Referencing JSON
            let products= data.items;
            products = products.map(item=>{
                //destructuring title & price from
                // fields in JSON
                //"price": 10.99 => "object" : property format
                //ES6   title & price are inside same  
                const {title, price} = item.fields;
                const {id} = item.sys;
                const image = item.fields.image.fields.file.url;
                return {title, price,id,image}
            });
            return products;
        } catch (error) {
            console.log(error);
        }
    }
}
//ui -display products retrived from the local storage

class UI{
    displayProducts(products){
        //empty string
        let result = '';
        //array => product
        products.forEach(product => {
                //    (`` called template literals, to access each props 
                //of the object in the array)

                //dynamic
            result += `
            <!--single product -->
                <article class="product">
                    <div class="img-container">
                        <img 
                        
                        src=${product.image} 
                        alt="product" class="product-img">
                        <button class="bag-btn" data-id=${product.id}>
                            <i class="fa fa-shopping-cart"></i>
                            add to cart
                        </button>
                    </div>
                    <h3>${product.title}</h3>
                    <h4>${product.price}</h4>


                </article>


                <!-- end of single product -->

            `;

            
        });
        productsDOM.innerHTML=result;
    }

    getBagButtons(){
        // [...doc     lorem => arrays, not list]
        const buttons = [...document.querySelectorAll('.bag-btn')];
        //foreach button, Yemi what do you want to do
        buttonsDOM = buttons;
        
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id ===id);
            if (inCart){
                button.innerText = "In Cart";
                button.disabled = true;

            }
            button.addEventListener('click', event =>{
                event.target.innerText = "In cart";
                event.target.disabled = true;


                    //get product from products {spread ... operation}
                let cartItem = {...Storage.getProduct(id), amount : 1 };
                // console.log(cartItem);


                
                //add item / product to the cart

                cart = [...cart, cartItem];


                
                //save cart in local storage
                Storage.saveCart(cart);
                    
                //set cart values
                this.setcartValues(cart);
                
                //display cart item
                this.addcartItem(cartItem);
                
                
                //show the cart
                this.showCart(); 




                    

            });
            
            
            

            
        });

    }



    setcartValues(cart){
        let tempTotal = 0;
        let itemsTotal= 0;
        cart.map(item=>{
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        cartTotal.innerText = parseFloat (tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
        
        


    }
    addcartItem(item){
        const div = document.createElement('div');
        div.classList.add('cart-item');

         //    (`` called template literals

        div.innerHTML = `<img src="./images/product-1.jpeg" 
        alt="product-1">

        <div>
            <h4>${item.title}</h4>
            <h5>${item.price}</h5>
            <span class="remove-item" data-id=
            ${item.id}>remove</span>
        </div>
       <div>
           <i class="fa fa-chevron-up" data-id=
           ${item.id}></i>

           <p class="item-amount">${item.amount}</p>
           <i class="fa fa-chevron-down" data-id=
           ${item.id}></i>
       </div>`; 
       cartContent.appendChild(div);
    }

    showCart() {
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');

        
    }
     
    setupAPP(){

        cart = Storage.getCart();

        //current value
        this.setcartValues(cart);
        this.populateCart(cart);

        //close btn using call back mthd of showcart
        cartBtn.addEventListener('click',this.showCart);
        closeCartBtn.addEventListener('click',this.hideCart);

    }

    populateCart(cart){
        cart.forEach(item => this.addcartItem(item));  
    }

    hideCart(){
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }

    cartLogic(){
        // clear cart button
        clearcartBtn.addEventListener('click',
        ()=> {
            this.clearCart();
        });

        // cart funtionality with EVENT BUBBLING
        cartContent.addEventListener('click', event => {
            if (event.target.classList.contains('remove-item')
            ){
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.
                    parentElement.parentElement);
                this.removeItem(id);               
            }
            else if(event.target.classList.contains("fa-chevron-up")){
            let addAmount = event.target;
            let id = addAmount.dataset.id;
            let tempItem= cart.find(item => item.id === id);
            tempItem.amount = tempItem.amount + 1;
            Storage.saveCart(cart);
            this.setcartValues(cart); 
            addAmount.nextElementSibling.innerText = 
            tempItem.amount;
        } 

        else if(event.target.classList.contains("fa-chevron-down")){
            let lowerAmount = event.target;
            let id = lowerAmount.dataset.id;
            let tempItem= cart.find(item => item.id === id);
            tempItem.amount =tempItem.amount - 1;
            if (tempItem.amount > 0){
                Storage.saveCart(cart);
                this.setcartValues(cart);
                lowerAmount.previousElementSibling.innerText=
                tempItem.amount;

            }
            else{
                cartContent.removeChild(lowerAmount.
                    parentElement.parentElement);
                this.removeItem(id);
            }
        }
        }); 

    }
    clearCart(){
        //get me the id of the item
        let cartItems = cart.map(item => item.id);
        //loop over all id in storage and run removeItem mthd
        cartItems.forEach(id => this.removeItem(id));
        console.log(cartContent.children);
        

        //from cart-content
        while (cartContent.children.length> 0) {
            //looping &removing first element children{0}
            cartContent.removeChild(cartContent.children[0])
            
        }
        this.hideCart();
        

        
       
    }
    removeItem(id){
        cart = cart.filter(item=> item.id !==id);
        this.setcartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fa 
        fa-shopping-cart"></i>add to cart`;
    }
    getSingleButton(id){
        return buttonsDOM.find(button => button.dataset.id 
        === id);
    }




}



//local storage

class Storage{
    static saveProducts(products){
        //set product element as key. 
        //and convert it to string
        localStorage.setItem("products", JSON.stringify
        (products));
       
    }
    //get product from products
    static getProduct(id){
        let products =JSON.parse(localStorage.getItem('products'));

        //findout if the product we are getting is matching
        return products.find(product => product.id === id);
    }

    static saveCart(cart){
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    static getCart(){
        return localStorage.getItem('cart') ?
        JSON.parse(localStorage.getItem('cart')):[];
         }
    }
    
    
    
    document.addEventListener("DOMContentLoaded", ()=> {
        const ui= new UI();
        const products = new Products();


        //setup application 
        ui.setupAPP();



        //get all products

        products.getProducts().then(products =>  {
            ui.displayProducts(products);
            Storage.saveProducts(products);
        }).then(()=>{
            ui.getBagButtons();
            ui.cartLogic();
            
        
        })
    });



 //USE CONTENTFUL.COM AS AN ALT TO JSON DATA
 //images from pexels.com 
// check text to svg site for Oriels logo
