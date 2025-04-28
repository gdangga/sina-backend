const express = require('express');
const router = express.Router();
const { tambahSiswa, cariSiswa, editSiswa, deleteSiswa } = require('../controller/siswaController');

router.post('/siswa', tambahSiswa);
router.get('/siswa', cariSiswa);
router.put('/siswa/:nis', editSiswa);
router.delete('/siswa/:nis', deleteSiswa);



module.exports = router;
