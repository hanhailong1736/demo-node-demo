const Result = require('../utils/tool');
const express = require('express');
const router = express.Router();
const model = require('../model');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const formidable = require('formidable');
const request = require("request");

router.all("/hone/statisticsReport", async (req, res) => {
  let params = req.body;
  if (Object.keys(params).length == 0) {
    params = req.query;
  }
  if (!params.type||!params.env) {
    res.json(
      new Result({
        code: 500,
        message: "参数缺失",
      })
    );
    return
  }
  let url = `https://ssdm-manage-qa.ss.honeywell.com.cn/statisticsReport?type=${params.type}&env=${params.env}&timezone=UTC-5&format=yyyy-MM-dd`;
  request(
    {
      url: url, //请求路径
      method: "GET", //请求方式，默认为get
      headers: {
        //设置请求头
        "content-type": "application/json",
      },
    },
    async function (error, response, body) {
      if (!error && response.statusCode == 200) {
        let result = JSON.parse(body);
        let list = [];
        let data = result.data
        if (data&&data.length) {
          if (!params.lastDate && !params.startDate) {
            list = data;
          } else {
            for (let index = 0; index < data.length; index++) {
              const element = data[index];
              if (params.lastDate) {
                if (params.startDate) {
                  if (element.name>=params.lastDate&&element.name>=params.startDate&&element.name<=params.endDate) {
                    list.push(element)  
                  }
                }else{
                  if (element.name>=params.lastDate){
                    list.push(element)
                  }
                }
              }else{
                if (element.name>=params.startDate&&element.name<=params.endDate) {
                  list.push(element)  
                }
              }
            }
          }
        }
        res.json(
          new Result({
            data: list,
            message: "success",
          })
        );
      } else {
        res.json(
          new Result({
            code: 500,
            message: "fail",
          })
        );
      }
    }
  );
});
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: "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",
});
router.all("/get_answer", async (req, res) => {
    let params = req.body;
    if (Object.keys(params).length == 0) {
      params = req.query;
    }
   
    if (!params.content) {
      res.json(new Result({
        code: 400,
        message: '内容不可为空'
      }))
      return
    }
    let now = Date.now();
    console.log("开始请求now=", now);
    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      // response_format:{ "type": "json_object" },
      messages: [
        {
          role: "user",
          content: params.content ?? "You are a helpful assistant.",
        },
      ],
      stream: true,
      temperature: 0,
    });
    // console.log("completion=", completion);
    // let message = completion.choices[0].message;
    // console.log("message=", message);

    for await (const chunk of completion) {
        console.log("开始响应耗时：", Date.now() - now);
        console.log(chunk.choices[0].delta.content);
        if (chunk.choices[0].finish_reason=='stop') {
            res.end(); // 结束传输
            console.log("总耗时：", Date.now() - now);
        }else{
            res.write(chunk.choices[0].delta.content);
        }
    }
    
    // let message = {
    //   content:'是的，当然啦。我每天都很开心。哈哈',
    //   role:'assistant'
    // }
    // res.json(
    //   new Result({
    //     message: message,
    //   })
    // );
  });

//图片上传
router.all('/image/upload', (req, res) => {
    let type = req.headers['content-type'] || '';
    if (!type.includes('multipart/form-data')) {
        res.json(new Result({
            code: 400,
            language: req.body.language || req.query.language,
            message: req.body.language == 'zh' ? '请求错误,请使用multipart/form-data格式' : 'Request error, please use multipart / form data format'
        }))
        return;
    }
    var form = new formidable.IncomingForm();
    // 设置上传图片保存文件
    form.uploadDir = '../data/uruimage';
    form.keepExtensions = true;
    // form.on('progress', (bytesReceived, bytesExpected) => {
    //     var precent = Math.floor(bytesReceived / bytesExpected * 100);
    //     console.log("进度=", precent);
    // })
    form.parse(req, function(err, fields, files) {
        if (err) {
            res.json(new Result({
                code: 400,
                message: err,
                data: {
                    status: false,
                    message: '上传失败!'
                }
            }))
            return
        }
        var filePath = ''; //如果提交文件的form中将上传文件的input名设置为file，就从file中取上传文件。否则取for in循环第一个上传的文件。        
        if (files.file) {
            filePath = files.file.path;
        } else {
            for (var key in files) {
                if (files[key].path && filePath === '') {
                    filePath = files[key].path;
                    break;
                }
            }
        }
        res.json(new Result({
            data: {
                status: true,
                message: '上传完成!',
                imageUrl: 'http://188.131.237.240' + filePath.substr(7)
            }
        }))
    });
});
module.exports = router;