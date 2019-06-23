const { Router } = require('express');

const router = Router();

router.post('/binds', async (req, res) => {
  let pos = JSON.parse(req.body)
  console.log(pos);
})
module.exports = router;