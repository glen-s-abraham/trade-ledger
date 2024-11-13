
function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateString.match(regex)) return false;
    
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}

module.exports = { isValidDate };
