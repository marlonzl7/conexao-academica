const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/notificacoesController');

router.get('/diretor/:idInstituicao', controller.verificarDiretor);

router.get('/coordenador/:idInstituicao/:idCurso', controller.verificarCoordenador);

router.get('/admin/:idInstituicao', controller.verificarAdminInstituicao);

module.exports = router;
