const express = require('express');
const router = express.Router();
const { addBook, getBooks, searchBooks, editBooks, deleteBook, getBookById } = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', authMiddleware, (req, res) => {
    console.log('Reached the /add route');
    addBook(req, res);
});
router.get('/', getBooks);
router.get('/search', searchBooks);
router.put('/edit/:id',authMiddleware, editBooks)
router.get('/:id',authMiddleware, getBookById)
router.delete('/delete/:id', authMiddleware, deleteBook);

module.exports = router;
