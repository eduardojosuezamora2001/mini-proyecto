/**
 * ==========================================================
 * LOCAL STORAGE GENERAL
 * Funciona para cualquier módulo del sistema.
 * Customers
 * Products
 * Suppliers
 * Settings
 * Dashboard
 * ==========================================================
 */

const Storage = {

    //==========================
    // OBTENER DATOS
    //==========================
    get(key){

        const data = localStorage.getItem(key);
        if (!data) return [];
        try {
            const parsed = JSON.parse(data);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.warn(`No se pudo leer la colección "${key}".`, error);
            return [];
        }

    },

    //==========================
    // GUARDAR
    //==========================
    save(key,data){

        localStorage.setItem(key,JSON.stringify(data));

    },

    //==========================
    // AGREGAR REGISTRO
    //==========================
    add(key,object){

        let data=this.get(key);

        object.id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

        object.createdAt = new Date().toLocaleString();

        data.push(object);

        this.save(key,data);

        return object;

    },

    //==========================
    // ACTUALIZAR
    //==========================
    update(key,id,newData){

        let data=this.get(key);

        data=data.map(item=>{

            if(String(item.id)===String(id)){

                return{

                    ...item,

                    ...newData,

                    updatedAt:new Date().toLocaleString()

                };

            }

            return item;

        });

        this.save(key,data);

    },

    //==========================
    // ELIMINAR
    //==========================
    delete(key,id){

        let data=this.get(key);

        data=data.filter(item=>String(item.id)!==String(id));

        this.save(key,data);

    },

    //==========================
    // BUSCAR POR ID
    //==========================
    find(key,id){

        return this.get(key).find(item=>String(item.id)===String(id));

    },

    //==========================
    // BUSCAR TEXTO
    //==========================
    search(key,text){

        let data=this.get(key);

        text=text.toLowerCase();

        return data.filter(item=>{

            return JSON.stringify(item)

                .toLowerCase()

                .includes(text);

        });

    },

    //==========================
    // CONTAR
    //==========================
    count(key){

        return this.get(key).length;

    },

    //==========================
    // EXISTE
    //==========================
    exists(key){

        return localStorage.getItem(key)!==null;

    },

    //==========================
    // LIMPIAR COLECCION
    //==========================
    clear(key){

        localStorage.removeItem(key);

    },

    //==========================
    // LIMPIAR TODO
    //==========================
    clearAll(){

        localStorage.clear();

    },

    //==========================
    // OBTENER ULTIMO
    //==========================
    last(key){

        let data=this.get(key);

        return data[data.length-1];

    },

    //==========================
    // REEMPLAZAR
    //==========================
    replace(key,data){

        this.save(key,data);

    },

    //==========================
    // EXPORTAR
    //==========================
    export(key){

        return JSON.stringify(this.get(key),null,2);

    },

    //==========================
    // IMPORTAR
    //==========================
    import(key,json){

        this.save(key,JSON.parse(json));

    }

};

window.Storage = Storage;
