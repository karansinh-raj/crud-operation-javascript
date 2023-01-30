class Products{
    constructor(productsRowElement, filterSelectInput){
        this.productsRowElement = productsRowElement;
        this.filterSelectInput = filterSelectInput;
    }

    fetchProducts(){
        this.products = JSON.parse(localStorage.getItem('products')) ?? [];
        this.displayProducts(this.products);
        this.displayFilterSelectItems(this.products);
    }

    searchProduct(searchKeyword){
        let filteredProducts;
        if(searchKeyword===''){
            filteredProducts = this.products;
        }else{
            filteredProducts = this.products.filter((product) => Object.keys(product).some(key => product[key].toLowerCase().includes(searchKeyword.toLowerCase())));
        }
        this.displayProducts(filteredProducts);
    }

    sortProducts(sortValue){
        let filteredProducts;
        if(sortValue === 'ProductName'){
            filteredProducts = this.products.sort((a,b) => a[sortValue].localeCompare(b[sortValue]));
        }
        else if(sortValue === 'Price-htl'){
            filteredProducts = this.products.sort((a,b) => b.Price - a.Price);
        }
        else{
            filteredProducts = this.products.sort((a,b) => a[sortValue] - b[sortValue]);
        }
        this.displayProducts(filteredProducts);
    }

    filterProducts(filterValue){
        console.log(filterValue)
        let filteredProducts;
        if(filterValue === ''){
            filteredProducts = this.products;
        }else{
            filteredProducts = this.products.filter((product)=> product.ProductId === filterValue);
        }
        this.displayProducts(filteredProducts);
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
        if(productImageString !== null){
            this.products[productIndex].Image = productImageString;
        }
        this.products[productIndex].Description = productDescription;

        localStorage.setItem('products',JSON.stringify(this.products));
        this.fetchProducts();
    }

    deleteProduct(productId){
        this.products = this.products.filter((product) => product.ProductId !== productId);
        localStorage.setItem('products',JSON.stringify(this.products));
        this.fetchProducts();
    }

    checkProductAlreadyExist(productId){
        const productIndex = this.products.findIndex((obj => obj.ProductId === productId));
        return productIndex === -1 ? false : true;
    }

    displayProducts(products){
        let productCards="";

        products.forEach(product =>{
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

    displayFilterSelectItems(products){
        let selectOptions = `<option value="">All</option>`;
        products.forEach(product =>{
            selectOptions += `<option value="${product.ProductId}">${product.ProductId} (${product.ProductName})</option>`
        });
        this.filterSelectInput.innerHTML = selectOptions;
    }
}

const productsRowElement = document.getElementById("products-row");

const productIdText = document.getElementById('product-id');
const productNameText = document.getElementById('product-name');
const productPriceText = document.getElementById('product-price');
const productDescriptionText = document.getElementById('product-description');
const productImageFile = document.getElementById('product-image');

const productIdErrorMessage = document.getElementById('product-id-error-msg');
const productNameErrorMessage = document.getElementById('product-name-error-msg');
const productPriceErrorMessage = document.getElementById('product-price-error-msg');
const productDescriptionErrorMessage = document.getElementById('product-description-error-msg');
const productImageErrorMessage = document.getElementById('product-image-error-msg');

const addNewProductForm = document.getElementById('add-new-product-form');
const addNewProductModal = document.getElementById('add-new-product-modal');
const productAddedToast = document.getElementById('product-added-toast');

const productIdTextUpdate = document.getElementById('product-id-update');
const productNameTextUpdate = document.getElementById('product-name-update');
const productPriceTextUpdate = document.getElementById('product-price-update');
const productDescriptionTextUpdate = document.getElementById('product-description-update');
const productImageFileUpdate = document.getElementById('product-image-update');

const productIdUpdateErrorMessage = document.getElementById('product-id-error-msg');
const productNameUpdateErrorMessage = document.getElementById('product-name-error-msg');
const productPriceUpdateErrorMessage = document.getElementById('product-price-error-msg');
const productDescriptionUpdateErrorMessage = document.getElementById('product-description-error-msg');
const productImageUpdateErrorMessage = document.getElementById('product-image-error-msg');

const updateProductForm = document.getElementById('update-product-form');
const updateProductModal = document.getElementById('update-product-modal');
const productUpdatedToast = document.getElementById('product-updated-toast');

const productDeletedToast = document.getElementById('product-deleted-toast');

const sortButtonsGroup = document.getElementById('sort-btn-group')
const filterSelectInput = document.getElementById('filter-select-input');

const products = new Products(productsRowElement, filterSelectInput);

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

    productIdText.setCustomValidity('');

    if(addNewProductForm.checkValidity() === false){
        addNewProductForm.classList.add('was-validated');
    }else{
        if(products.checkProductAlreadyExist(productId)){
            productIdText.setCustomValidity('product id already exist!');
            productIdErrorMessage.innerText = 'product id already exist!';
            addNewProductForm.classList.add('was-validated');
        }else{
            const productImageString = await convertBase64(productImage);
            let newProduct = {
                ProductId: productId,
                ProductName: productName,
                Image: productImageString,
                Price: productPrice,
                Description: productDescription
            };
            products.addProduct(newProduct);

            $('#add-new-product-modal').modal('hide');

            const toast = new bootstrap.Toast(productAddedToast);
            toast.show();
        }
    }
}

function passDataToModal(productString){
    const product = JSON.parse(decodeURIComponent(productString));
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

    if(updateProductForm.checkValidity() === false){
        updateProductForm.classList.add('was-validated');
    }else{
        let productImageString;
        if(productImage){
            productImageString = await convertBase64(productImage);
        }else{
            productImageString = null;
        }
        products.updateProduct(productId, productName, productPrice, productDescription, productImageString);

        $('#update-product-modal').modal('hide');

        const toast = new bootstrap.Toast(productUpdatedToast);
        toast.show();
    }
}

function deleteProduct(productId){
    products.deleteProduct(productId);

    const toast = new bootstrap.Toast(productDeletedToast);
    toast.show();
}

function searchProduct(searchKeyword){
    products.searchProduct(searchKeyword);
}

sortButtonsGroup.onclick = ()=>{
    const buttons = document.querySelectorAll('input[name="sort-btn"]');
    for(let button of buttons){
        if(button.checked){
            products.sortProducts(button.value);
        }  
    }
}

function filterProducts(filterValue){
    products.filterProducts(filterValue);
}