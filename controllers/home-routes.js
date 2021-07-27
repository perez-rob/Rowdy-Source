const router = require('express').Router();
const { Project, User } = require('../models');
// import auth middleware

router.get('/', async (req, res) => {
  try {
    const projectData = await Project.findAll({
      include: [{ model: User, attributes: ['name', 'email'] }],
    });

    const projects = projectData.map((project) => project.get({ plain: true }));
    // REMOVE
    console.log(projects);
    res.render('homepage', { projects });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/project/:id', async (req, res) => {
  try {
    const projectData = await Project.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['name', 'email'] }],
    });

    if (!projectData) {
      res
        .status(400)
        .send(`<h1>No project exists with ID: ${req.params.id} </h1>`);
    }

    const project = projectData.get({ plain: true });
    // REMOVE
    console.log(project);
    res.render('projectHighlight', { project });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
