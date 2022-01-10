
const SUPABASE_URL = 'https://epehvjenfpvxbqdmqfbu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTUxMjY2NiwiZXhwIjoxOTU3MDg4NjY2fQ.8rrOTd9Kj9vv9197Iw2W3Xop_HoTU_4wkApFKoaZPFI';

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);



export async function createItem(item, quantity) {
    const response = await client
        .from('shopping_list')
        .insert([{ item, quantity }]);
    // RLS settings should make it so we don't need to add user_id
        
    return checkError(response);
}

export async function deleteAllItems() {
    const response = await client
        .from('shopping_list')
        .delete()
        .match({ user_id: client.auth.user().id });

    return checkError(response);
}

export async function getItems() {
    const response = await client
        .from('shopping_list')
        .select();
        // make sure it only grabs items that belong to this user
        // ^depends on RLS and user_id

    return checkError(response);
}

export async function buyItem(id) {
    const response = await client
        .from('shopping_list')
        .update({ bought: true })
        .match({ id: id });

    return checkError(response);
}

export function renderItem(item) {
    // create a p tag
    const itemEl = document.createElement('p');
    // add the 'item' css class no matter what
    itemEl.classList.add('item');

    itemEl.textContent = `${item.quantity} ${item.item}`;

    itemEl.classList.add(item.bought ? 'bought' : 'not-bought');
  
    if (!item.bought) {
        itemEl.addEventListener('click', async() => {
            await buyItem(item.id);
            getItems();
            renderItem(item);
        });
    }
}

// export function displayList()

// everything should be good below this point (taken from template)
export async function getUser() {
    return client.auth.session();
}


export async function checkAuth() {
    const user = await getUser();

    if (!user) location.replace('../'); 
}

export async function redirectIfLoggedIn() {
    if (await getUser()) {
        location.replace('./other-page');
    }
}

export async function signupUser(email, password){
    const response = await client.auth.signUp({ email, password });
    
    return response.user;
}

export async function signInUser(email, password){
    const response = await client.auth.signIn({ email, password });

    return response.user;
}

export async function logout() {
    await client.auth.signOut();

    return window.location.href = '../';
}

function checkError({ data, error }) {
    return error ? console.error(error) : data;
}
