const express = require('express')

const router = express.Router()

const imgCntrl = require('../controller/imgCntrl')

router.post('/', imgCntrl.addImg);
router.get('/', imgCntrl.getImg);
router.delete('/:id', imgCntrl.delImg);
router.put('/:id', imgCntrl.updateImg);

module.exports = router