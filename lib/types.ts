export type Product={id:string;title:string;slug:string;description:string;main_image:string;status:string;created_at:string}
export type Category={id:string;name:string;slug:string;parent_id:string|null;image:string|null;status:string}
export type Variation={id:string;product_id:string;name:string;value:string;description:string|null;price:number;stock:number;sku:string|null;image:string|null}
