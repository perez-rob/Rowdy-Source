const router = require('express').Router();
const { Project, User } = require('../models');
// import auth middleware

router.get('/', async (req, res) => {
  try {
    const projectData = await Project.findAll({
      include: [{ model: User }],
    });

    const projects = projectData.map((project) => project.get({ plain: true }));
    console.log(projects);
    res.render('homepage', { projects });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
