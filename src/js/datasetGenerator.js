/** Generador determinista de datos de prueba relacionados. */
const DataGenerator = (() => {
  const firstNames=["Ana","Carlos","Daniela","Esteban","Fernanda","Gabriel","Helena","Isaac","Julia","Kevin","Laura","Marco","Natalia","Óscar","Paula","Ricardo"],lastNames=["Alvarado","Brenes","Castro","Díaz","Espinoza","Flores","Gómez","Herrera","Jiménez","Mora","Navarro","Quesada"],categories=["Electronics","Accessories","Office","Networking","Storage","Audio"];
  const pad=(value)=>String(value).padStart(3,"0");
  function generate(){
    const suppliers=Array.from({length:40},(_,i)=>({id:`demo-s-${pad(i+1)}`,companyName:`Proveedor ${lastNames[i%lastNames.length]} ${pad(i+1)}`,contactPerson:`${firstNames[i%firstNames.length]} ${lastNames[(i+3)%lastNames.length]}`,contactInfo:{email:`proveedor${i+1}@demo.cr`,phone:`+506 2200-${1000+i}`},address:`Zona Industrial ${i+1}, Costa Rica`,status:i%9===0?"Inactive":"Active"}));
    const customers=Array.from({length:80},(_,i)=>({id:`demo-c-${pad(i+1)}`,name:`${firstNames[i%firstNames.length]} ${lastNames[i%lastNames.length]}`,email:`cliente${i+1}@demo.cr`,phone:`+506 8800-${1000+i}`,status:i%11===0?"inactive":i%7===0?"pending":"active",lastOrder:i%5===0?"No orders yet":`${i%20+1} days ago`}));
    const products=Array.from({length:90},(_,i)=>({id:`demo-p-${pad(i+1)}`,name:`Producto ${categories[i%categories.length]} ${pad(i+1)}`,sku:`${categories[i%categories.length].slice(0,3).toUpperCase()}-${pad(i+1)}`,category:categories[i%categories.length],price:Number((9.95+(i*7.35)%390).toFixed(2)),stock:i%13===0?0:i%7===0?5:20+(i*17)%180,status:i%13===0?"out_of_stock":"active",supplierId:suppliers[i%suppliers.length].id,image:""}));
    return{customers,products,suppliers};
  }
  function ensureMinimum(minimum=200){const entities=["customers","products","suppliers"],current=entities.reduce((n,e)=>n+Storage.count(e),0);if(current>=minimum)return current;Object.entries(generate()).forEach(([entity,records])=>{const existing=Storage.get(entity),ids=new Set(existing.map((item)=>String(item.id)));Storage.save(entity,[...existing,...records.filter((item)=>!ids.has(String(item.id)))])});return entities.reduce((n,e)=>n+Storage.count(e),0)}
  return{generate,ensureMinimum};
})();
window.DataGenerator=DataGenerator;
