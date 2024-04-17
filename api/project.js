const router = require('express').Router()
const model = require('../models/project');
const codeModel = require('../models/code');
const {
  Op,
  Sequelize
} = require('sequelize');

router.get('/', async(req, res) => {
  
  try {
    const id = req.query?.id || '';
    if (id) {
      const result = await model.findOne({ where: { id:id } });
      res.send({
        msg: '查询成功',
        data: result,
      })
    } else {
      const where = {}
      const {type,name,size,page} = req.query;
      name && (where['name'] = {
        [Op.like]: `%${name}%`
      })
      type && (where['type'] = {
        [Op.eq]: type
      })
      const { count , rows} = await model.findAndCountAll({
        where,
        attributes: ['id', 'name', 'type', 'owner',
        // [Sequelize.fn('COUNT', Sequelize.col('codes.id')), 'monitorCount']
          [Sequelize.literal(`(SELECT COUNT(*) FROM Codes WHERE Codes.projectId = Project.id and Codes.deletedAt is null)`), 'monitorCount']
        ],
        include: [{
          model: codeModel,
          attributes: [],
        }],
        group: ['Project.id'],
        limit: Number(size),
        offset: (Number(page)-1) * Number(size),
      });
      res.send({
        msg: '查询成功',
        data: {
          total:count.length,
          list:rows
        },
      })
    }
  } catch (error) {
    console.log(error);
    res.send({
      msg: '查询失败'
    })
  }
  
})

router.post('/', async(req, res) => {
  try {
    const data = req.body;
    const [_,created] = await model.findOrCreate({
      where: { name: data.name },
      defaults: {...data}
    });
    if (created) {
      res.send({
        code:200,
        success: true,
        msg: '增加成功',
      })
    } else {
      res.send({
        msg: '已存在',
      })
    }
  } catch (error) {
    console.log(error);
    res.send({
      msg: '添加失败' + error

    })
  }
  
})


router.put('/', async(req, res) => {
  try {
    const data = req.body;
    const result =model.update({...data}, {
      where: {
        id: data.id
      }
    })
    res.send({
      msg: '修改成功',
      data: result,
    })
  } catch (error) {
    res.send({
      msg: '修改失败',
    })
  }
})

router.delete('/', async(req, res) => {
  try {
    const id = req.body.id;
    const result = await model.destroy({
      where: {
        id: id,
      }
    });
    res.send({
      msg: '删除成功',
    })
  } catch (error) {
    res.send({
      msg: '删除失败',
    })
  }
  
})

module.exports = router