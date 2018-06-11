import uniqid from "uniqid";

export default class List {
    constructor(){
        this.items = [];
    }

    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count:count,
            unit:unit,
            ingredient:ingredient
        }
        this.items.push(item);
    }

    deleteItem (id) {
        //This will find the index of the id
        const index = this.items.findIndex(element => element.id === id);
        //Then remove it from the array
        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        this.items.find(element => element.id === id).count = newCount;
    }
}