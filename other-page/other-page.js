import { checkAuth, logout, deleteAllItems, buyItem, getItems, createItem, renderItem } from '../fetch-utils.js';

checkAuth();

const listEl = document.querySelector('.list');
const itemForm = document.querySelector('.item-form');
const logoutButton = document.querySelector('#logout');
const deleteButton = document.querySelector('.delete-button');

itemForm.addEventListener('submit', async(e) => {
    // on submit, create a item, reset the form, and display the items
    e.preventDefault();

    const data = new FormData(itemForm);

    const item = data.get('item');
    const quantity = data.get('quantity');

    await createItem(item, quantity);
    // reset form
    itemForm.reset();
    //fetch and display items
    await fetchAndDisplayItems();
});

async function fetchAndDisplayItems() {
    // fetch the todos
    const items = await getItems();
    // clear out todosEl
    listEl.textContent = '';
    // display the list of todos
    for (let item of items) {
        const itemEl = renderItem(item);
        
        // be sure to give each todo an event listener
        // on click, complete that todo
        itemEl.addEventListener('click', async() => {
            await buyItem(item.id);

            fetchAndDisplayItems();
        });
        listEl.append(itemEl);
    }

}


// add an on load listener that fetches and displays items on load
window.addEventListener('load', async() => {
    await fetchAndDisplayItems();
});

logoutButton.addEventListener('click', () => {
    logout();
});


deleteButton.addEventListener('click', async() => {
    // delete all items
    await deleteAllItems();
    // then refetch and display the updated list of items
    fetchAndDisplayItems();
});
