const router = require('express').Router();
const sequelize = require('../config/connection');
const { Project, User } = require('../models');
const Op = require('sequelize').Op;
// import auth middleware

router.get('/', async (req, res) => {
  try {
    const projectData = await Project.findAll({
      include: [{ model: User, attributes: ['name', 'email'] }],
    });

    const projects = projectData.map((project) => project.get({ plain: true }));
    // REMOVE
    console.log('SESSSION', req.session.loggedIn);
    res.render('homepage', { projects, loggedIn: req.session.loggedIn });
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

    const otherProjectData = await Project.findAll({
      where: {
        user_id: projectData.user_id,
        id: {
          [Op.ne]: projectData.id,
        },
      },
    });

    const project = projectData.get({ plain: true });

    const otherProjects = otherProjectData.map((other) =>
      other.get({ plain: true })
    );
    // REMOVE
    console.log(project);
    res.render('projectHighlight', {
      project,
      otherProjects,
      loggedIn: req.session.loggedIn,
      userId: req.session.user_id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/login', async (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

router.get('/profile', async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      include: [{ model: Project }],
      attributes: {
        exclude: ['password'],
      },
    });

    const user = await userData.get({ plain: true });
    // REMOVE
    console.log(user);

    res.render('profile', {
      user,
      loggedIn: req.session.loggedIn,
      userId: req.session.user_id,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
