const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
var products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const precioFinal = (precio, descuento)=> Math.round(precio-(precio*descuento/100))
const controller = {
	// Root - Show all products
	index: (req, res) => {
		res.render("products",{products, toThousand})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		const id=req.params.id
		const producto= products.find(element=>element.id=== +id)
		res.render("detail",{producto,precioFinal,toThousand})
	},

	// Create - Form to create
	create: (req, res) => {
		res.render("product-create-form")
	},
	
	// Create -  Method to store
	store: (req, res) => {
		let nuevoProducto=req.body
		nuevoProducto.id=products.length+1
		products.push(nuevoProducto)
		
		fs.writeFileSync(productsFilePath, JSON.stringify(products, null , 2))
		res.redirect(`/products/detail/${nuevoProducto.id}`)
		
	},

	// Update - Form to edit
	edit: (req, res) => {
		const {id}=req.params
		const productEdit=products.find(e=>e.id=== +id)
		res.render("product-edit-form",{productEdit},)
	},
	// Update - Method to update
	update: (req, res) => {
		const productUpdate = products.find(product=>product.id=== +req.params.id)
		const {name,price,discount,category,desctiption}=req.body
		if(productUpdate){
			productUpdate.name= name
			productUpdate.price= +price
			productUpdate.discount= +discount
			productUpdate.category= category
			productUpdate.desctiption= desctiption
			
			fs.writeFileSync(productsFilePath,JSON.stringify(products, null,2))
			res.redirect(`/products/detail/${+req.params.id}`)
		}
		else{
			res.redirect("/")
		}
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		products = products.filter(product=> product.id !== +req.params.id)
		fs.writeFileSync(productsFilePath,JSON.stringify(products, null,2))
		res.redirect("/")
	}
};

module.exports = controller;