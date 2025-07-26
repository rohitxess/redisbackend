// to store hash data and string data 
// bites: restaurant: hhhius

export function getKeyName(...args: string[]) {
    return `bites: ${args.join(':')}`;
}


export const resturantKeyById = (id: string) => getKeyName('restaurants', id);
export const reviewById = (id: string) => getKeyName('reviews', id);
export const reviewDeatilsKeyById = (id: string) => getKeyName('reviewDetails', id);