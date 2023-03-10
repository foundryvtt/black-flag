export function itemCreate(itemData, options, userId) {
    updateItem(itemData);
}

export function itemUpdate(itemData, options, userId) {
    updateItem(itemData);
}

export function itemDelete(itemData, options, userId) {
    updateItem(itemData, true);
}

function updateItem(itemData, deleted=false) {
    if (itemData.type === "class") {
        if (deleted) CONFIG.SYSTEM.CLASS_DOCUMENTS.delete(itemData._id);
        else CONFIG.SYSTEM.CLASS_DOCUMENTS.set(itemData._id, itemData);
    }
}
