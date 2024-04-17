const router = require('express').Router()
const model = require('../models/monitor');
const now = require('dayjs');
const { Op,Sequelize } = require('sequelize')

router.get('/', async(req, res) => {
  
  try {
    const { id, size, page,name,startTime,endTime} = req.query;
    const where = {}
    name && (where['name'] = {
      [Op.like]: `%${name}%`
    })
    id && (where['codeId'] = {
      [Op.eq]: id
    })
    startTime && endTime && (where['createTime'] = {
      [Op.between]: [startTime,endTime]
    })
    const { count , rows} = await model.findAndCountAll({
      where,
      limit: Number(size), 
      offset: (Number(page)-1) * Number(size),
    });
    const result = await model.count({
      where: {
        codeId: {
          [Op.eq]: id
        },
        createTime: {
          [Op.between]: [now().subtract(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),now().endOf('date').format('YYYY-MM-DD HH:mm:ss')]
        }
      },
      attributes:[[Sequelize.fn('DATE_FORMAT',Sequelize.col('createTime'), '%d %H'),'hour']],
      group:['hour'],
    });
    let resultArr = result.map(item=>{
      return {
        date:Number(item.hour.split(' ')[1]),
        type:item.hour.split(' ')[0] == now().format('DD') ? '今日':'昨日',
        value:item.count,
      }
    })
    lineArr = new Array(24).fill({date:'',type:'今日',value:0}).map((item,index) => { return {...item,date:index}}).concat(new Array(24).fill({date:'',type:'昨日',value:0}).map((item,index) => { return {...item,date:index}}))
    resultArr.forEach((item,index) => {
      const num = lineArr.findIndex(ele => ele.date == item.date && item.type == ele.type)
      lineArr[num] = item
    })
    res.send({
      msg: '查询成功',
      data: {
        line:lineArr,
        total:count,
        list:rows
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
    const result = await model.create({...data});
    res.send({
      msg: '增加成功',
    })
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