export class Product {
    idProduct?: number;
    name?:string;
    description?:string;
    quantityInStock?:number;
    buyPrice?:number;
    maxCacaoBuyPrice?:number;
    fkStore?:number;

    constructor(product: Product){
        this.idProduct=product.idProduct;
        this.name=product.name;
        this.description=product.description;
        this.quantityInStock=product.quantityInStock;
        this.buyPrice=product.buyPrice;
        this.maxCacaoBuyPrice=product.maxCacaoBuyPrice;
        this.fkStore=product.fkStore;
    }


}