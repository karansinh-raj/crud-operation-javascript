class Products{
    constructor(productsRowElement){
        this.productsRowElement = productsRowElement;
    }

    fetchProducts(){
        this.products = JSON.parse(localStorage.getItem('products')) ?? [];
        this.displayProducts();
    }

    addProduct(product){
        this.products = JSON.parse(localStorage.getItem('products')) ?? [];
        this.products.push(product);
        localStorage.setItem('products',JSON.stringify(this.products));
        this.fetchProducts();
    }

    updateProduct(productId, productName, productPrice, productDescription, productImageString){
        const productIndex = this.products.findIndex((obj => obj.ProductId === productId));

        this.products[productIndex].ProductName = productName;
        this.products[productIndex].Price = productPrice;
        this.products[productIndex].Image = productImageString;
        this.products[productIndex].Description = productDescription;

        localStorage.setItem('products',JSON.stringify(this.products));
        this.fetchProducts();
    }

    deleteProduct(productId){
        this.products = this.products.filter((product) => product.ProductId !== productId);
        localStorage.setItem('products',JSON.stringify(this.products));
        this.fetchProducts();
    }

    displayProducts(){
        let productCards="";

        this.products.forEach(product =>{
            console.log(product)
            productCards += `<div class="col-auto">
            <div class="card shadow-lg">
                <img src="${product.Image}" alt="${product.ProductName}" class="card-image">
                <div class="card-body">
                    <h5 class="card-title">${product.ProductName}</h5>
                    <p class="card-price">Rs. ${product.Price}</p>
                    <p class="card-description">${product.Description}</p>
                    <div class="card-buttons">
                        <button type="button" class="btn btn-outline-secondary" onclick="passDataToModal('${encodeURIComponent(JSON.stringify(product))}')" data-bs-toggle="modal" data-bs-target="#update-product-modal">Update</button>
                        <button type="button" class="btn btn-outline-danger" onclick="deleteProduct('${product.ProductId}')">Delete</button>
                    </div>
                </div>              
            </div>
        </div>`;
        });

        this.productsRowElement.innerHTML = productCards;
    }
}

const productsRowElement = document.getElementById("products-row");

const productIdText = document.getElementById('product-id');
const productNameText = document.getElementById('product-name');
const productPriceText = document.getElementById('product-price');
const productDescriptionText = document.getElementById('product-description');
const productImageFile = document.getElementById('product-image');

const addNewProductModal = document.getElementById('add-new-product-modal');

const productIdTextUpdate = document.getElementById('product-id-update');
const productNameTextUpdate = document.getElementById('product-name-update');
const productPriceTextUpdate = document.getElementById('product-price-update');
const productDescriptionTextUpdate = document.getElementById('product-description-update');
const productImageFileUpdate = document.getElementById('product-image-update');

const products = new Products(productsRowElement);

window.onload = ()=>{
    products.fetchProducts();
}

const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};

async function addProduct(){
    const productId = productIdText.value;
    const productName = productNameText.value;
    const productPrice = productPriceText.value;
    const productDescription = productDescriptionText.value;
    const productImage = productImageFile.files[0];

    const productImageString = await convertBase64(productImage);

    let newProduct = {
        ProductId: productId,
        ProductName: productName,
        Image: productImageString,
        Price: productPrice,
        Description: productDescription
    };
    
    products.addProduct(newProduct);
}

function passDataToModal(productString){
    const product = JSON.parse(decodeURIComponent(productString));
    console.log(product)
    document.getElementById('product-id-update').value = product.ProductId;
    document.getElementById('product-name-update').value = product.ProductName;
    document.getElementById('product-price-update').value = product.Price;
    document.getElementById('product-description-update').value = product.Description;
}

async function updateProduct(){
    const productId = productIdTextUpdate.value;
    const productName = productNameTextUpdate.value;
    const productPrice = productPriceTextUpdate.value;
    const productDescription = productDescriptionTextUpdate.value;
    const productImage = productImageFileUpdate.files[0];

    const productImageString = await convertBase64(productImage);
    
    products.updateProduct(productId, productName, productPrice, productDescription, productImageString);
}

function deleteProduct(productId){
    products.deleteProduct(productId);
}