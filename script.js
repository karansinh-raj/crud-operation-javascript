class Products{
    constructor(productsRowElement, productsNotFoundRowElement, filterSelectInput){
        this.productsRowElement = productsRowElement;
        this.productsNotFoundRowElement = productsNotFoundRowElement;
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

    updateProduct(productId, productName, productPrice, productDescription, productImageString, productImageName){
        const productIndex = this.products.findIndex((obj => obj.ProductId === productId));

        this.products[productIndex].ProductName = productName;
        this.products[productIndex].Price = productPrice;
        if(productImageString !== null && productImageName !== null){
            this.products[productIndex].Image = productImageString;
            this.products[productIndex].ImageName = productImageName;
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

    checkProductAlreadyExist(productName){
        const productIndex = this.products.findIndex((obj => obj.ProductName === productName));
        return productIndex === -1 ? false : true;
    }

    displayProducts(products){
        if(products === null || products.length === 0){
            productsNotFoundRowElement.style.display = "block";
            productsRowElement.style.display = "none";
        }else{
            productsNotFoundRowElement.style.display = "none";
            productsRowElement.style.display = "flex";
            let productCards="";

            products.forEach(product =>{
                productCards += `<div class="col-lg-3 col-md-6 col-sm-12">
                    <div class="card shadow-lg">
                        <img src="${product.Image}" alt="${product.ProductName}" class="card-image">
                        <div class="card-body">
                            <p class="card-subtitle">Product Id: ${product.ProductId}</p>
                            <h5 class="card-title">${product.ProductName}</h5>
                            <p class="card-price">Rs. ${Number(product.Price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
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

    displayFilterSelectItems(products){
        let selectOptions = `<option value="">All</option>`;
        products.forEach(product =>{
            selectOptions += `<option value="${product.ProductId}">${product.ProductId} (${product.ProductName})</option>`
        });
        this.filterSelectInput.innerHTML = selectOptions;
    }
}

const productsRowElement = document.getElementById("products-row");
const productsNotFoundRowElement = document.getElementById("products-not-found-row");

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

const products = new Products(productsRowElement, productsNotFoundRowElement, filterSelectInput);

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

function createUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

async function addProduct(){
    // const productId = productIdText.value;
    const productId = createUUID();
    const productName = productNameText.value;
    const productPrice = productPriceText.value;
    const productDescription = productDescriptionText.value;
    const productImage = productImageFile.files[0];

    productNameText.setCustomValidity('');
    productImageFile.setCustomValidity('');

    if(addNewProductForm.checkValidity() === false){
        addNewProductForm.classList.add('was-validated');
    }else{
        let idxDot = productImage.name.lastIndexOf(".") + 1;
        let extFile = productImage.name.substr(idxDot, productImage.length).toLowerCase();

        if(products.checkProductAlreadyExist(productName)){
            productNameText.setCustomValidity('product name already exist');
            productNameErrorMessage.innerText = 'product name already exist';
            addNewProductForm.classList.add('was-validated');
        }else if(!(extFile === "jpg" || extFile === "jpeg" || extFile === "png" || extFile === "webp")){
            productImageFile.setCustomValidity('product image is invalid');
            productImageErrorMessage.innerText = 'product image is invalid';
            addNewProductForm.classList.add('was-validated');
        }
        else{
            const productImageString = await convertBase64(productImage);
            let newProduct = {
                ProductId: productId,
                ProductName: productName,
                Image: productImageString,
                ImageName: productImage.name,
                Price: productPrice,
                Description: productDescription
            };

            products.addProduct(newProduct);

            $('#add-new-product-modal').modal('hide');
            const toast = new bootstrap.Toast(productAddedToast);
            toast.show();

            addNewProductForm.reset();
            if(addNewProductForm.classList.contains('was-validated')){
                addNewProductForm.classList.remove('was-validated');
            }
        }
    }
}

function passDataToModal(productString){
    const product = JSON.parse(decodeURIComponent(productString));
    document.getElementById('product-id-update').value = product.ProductId;
    document.getElementById('product-name-update').value = product.ProductName;
    document.getElementById('product-price-update').value = product.Price;
    document.getElementById('product-description-update').value = product.Description;
    document.getElementById('product-image-view-update').src = product.Image;
    document.getElementById('product-image-view-name').innerHTML = product.ImageName;
}

async function updateProduct(){
    const productId = productIdTextUpdate.value;
    const productName = productNameTextUpdate.value;
    const productPrice = productPriceTextUpdate.value;
    const productDescription = productDescriptionTextUpdate.value;
    const productImage = productImageFileUpdate.files[0];

    productImageFileUpdate.setCustomValidity('');

    if(updateProductForm.checkValidity() === false){
        updateProductForm.classList.add('was-validated');
    }else{
        let productImageString;
        let productImageName;

        if(productImage){
            let idxDot = productImage.name.lastIndexOf(".") + 1;
            let extFile = productImage.name.substr(idxDot, productImage.length).toLowerCase();

            if(!(extFile === "jpg" || extFile === "jpeg" || extFile === "png" || extFile === "webp")){
                productImageFileUpdate.setCustomValidity('product image is invalid');
                productImageUpdateErrorMessage.innerText = 'product image is invalid';
                updateProductForm.classList.add('was-validated');
            }else{
                productImageString = await convertBase64(productImage);
                productImageName = productImage.name;

                products.updateProduct(productId, productName, productPrice, productDescription, productImageString, productImageName);
                $('#update-product-modal').modal('hide');
                const toast = new bootstrap.Toast(productUpdatedToast);
                toast.show();

                updateProductForm.reset();
                if(updateProductForm.classList.contains('was-validated')){
                    updateProductForm.classList.remove('was-validated');
                }
            }
        }
        else{
            productImageString = null;
            productImageName = null;

            products.updateProduct(productId, productName, productPrice, productDescription, productImageString, productImageName);
            $('#update-product-modal').modal('hide');
            const toast = new bootstrap.Toast(productUpdatedToast);
            toast.show();

            updateProductForm.reset();
            if(updateProductForm.classList.contains('was-validated')){
                updateProductForm.classList.remove('was-validated');
            }
        }
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

async function displayImage(item){
    const productImage = item.files[0];
    let productImageString;
    let productImageName;

    if(productImage){
        let idxDot = productImage.name.lastIndexOf(".") + 1;
        let extFile = productImage.name.substr(idxDot, productImage.length).toLowerCase();

        if(!(extFile === "jpg" || extFile === "jpeg" || extFile === "png" || extFile === "webp")){
            productImageFileUpdate.setCustomValidity('product image is invalid');
            productImageUpdateErrorMessage.innerText = 'product image is invalid';
            updateProductForm.classList.add('was-validated');
        }else{
            productImageString = await convertBase64(productImage);
            productImageName = productImage.name;

            document.getElementById('product-image-view-update').src = productImageString;
            document.getElementById('product-image-view-name').innerHTML = productImageName;
        }
    }
}

function closeUpdateModal(){
    if(updateProductForm.classList.contains('was-validated')){
        updateProductForm.classList.remove('was-validated');
    }
    updateProductForm.reset();
}

function closeAddModal(){
    if(addNewProductForm.classList.contains('was-validated')){
        addNewProductForm.classList.remove('was-validated');
    }
    addNewProductForm.reset();
}