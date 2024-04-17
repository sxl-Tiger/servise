const router = require('express').Router()
const model = require('../models/code');
const monitorModel = require('../models/monitor');
const now = require('dayjs');

const { Op,Sequelize } = require('sequelize')

router.get('/', async(req, res) => {
 
  
  try {
    const where = {}
    const {startTime,endTime,projectId,id,name,code,size,page} = req.query;
    projectId && (where['projectId'] = {
      [Op.eq]: projectId
    })
    id && (where['id'] = {
      [Op.eq]: id
    })
    startTime && endTime && (where['createTime'] = {
      [Op.between]: [startTime,endTime]
    })
    name && (where['name'] = {
      [Op.like]: `%${name}%`
    })
    code && (where['code'] = {
      [Op.eq]: code
    })
    let { count , rows} = await model.findAndCountAll({
      where,
      attributes: ['code', 'id', 'name', 'projectId'],
      // include: [{
      //   model: monitorModel,
      //   attributes:[[Sequelize.fn('COUNT', Sequelize.col('monitors.id')),'count']],
      //   where: {
      //     createTime:{
      //       [Op.between]: [
      //         new Date(),
      //         new Date() - 24*60*60*1000,
      //       ],
      //     }
      //   },
      //   group: ['Monitor.id'],
      // }],
      group: ['Code.id'],
      raw: true,
      limit: Number(size),
      offset: (Number(page)-1) * Number(size),
    })
    // result.forEach(async element => {
    //   const res = await monitorModel.count({
    //     where:{
    //       codeId:{
    //         [Op.eq]:element.id
    //       },
    //       createTime:{
    //         [Op.between]: [new Date(),new Date() - 24*60*60*1000,],
    //       }
    //     }
    //   })
      
    //   element.count = res;
    // });
    const p = await Promise.allSettled(rows.map(async (item) => {
      const countToday =  await monitorModel.count({
          where:{
            codeId:{
              [Op.eq]:item.id
            },
            createTime:{
              [Op.between]: [now().startOf('date').format('YYYY-MM-DD HH:mm:ss'),now().endOf('date').format('YYYY-MM-DD HH:mm:ss')],
            }
          }
        })
      const countYesterday =  await monitorModel.count({
        where:{
          codeId:{
            [Op.eq]:item.id
          },
          createTime:{
            [Op.between]: [now().subtract(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),now().subtract(1, 'day').endOf('day').format('YYYY-MM-DD HH:mm:ss')],
          }
        }
      })

        return {
          ...item,
          countToday,
          countYesterday
        }
    }))
    res.send({
      msg: '查询成功',
      data: {
        total:count.length,
        list:p.filter((item) => item.status === 'fulfilled').map((item) => item.value)
      },
    })
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
      msg: '添加失败'
    })
  }
  
})


router.put('/', async(req, res) => {
  try {
    const data = req.body;
    const result =model.update({
      code: data.code,
      name:data.name
    }, {
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