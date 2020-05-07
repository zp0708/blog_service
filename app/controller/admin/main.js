'use strict';

const Controller = require('egg').Controller;

class MainController extends Controller {
  async index() {
    this.ctx.body = 'api接口';
  }

  async checkLogin() {
    const userName = this.ctx.request.body.userName;
    const password = this.ctx.request.body.password;

    const sql =
      "SELECT userName FROM admin_user WHERE userName = '" +
      userName +
      "' AND password = '" +
      password +
      "'";
    const res = this.app.mysql.query(sql);

    if (res) {
      const openId = new Date().getTime();
      this.ctx.session.openId = { token: openId };
      this.ctx.body = { data: '登录成功', token: openId };
    } else {
      this.ctx.body = {
        data: '登录失败',
        u: userName,
        p: password,
        r: res,
        s: sql,
      };
    }
  }

  async getTypeInfo() {
    const results = await this.app.mysql.select('type');
    this.ctx.body = { data: results };
  }

  async getAdminUsers() {
    const sql = 'SELECT * FROM admin_user';
    const res = this.app.mysql.query(sql);

    this.ctx.body = { data: res, s: sql };
  }

  async addArticle() {
    const tmpArticle = this.ctx.request.body;
    // tmpArticle.
    const result = await this.app.mysql.insert('article', tmpArticle);
    const insertSuccess = result.affectedRows === 1;
    const insertId = result.insertId;

    this.ctx.body = {
      isScuccess: insertSuccess,
      insertId,
    };
  }

  async updateArticle() {
    const tmpArticle = this.ctx.request.body;
    // tmpArticle.
    const result = await this.app.mysql.update('article', tmpArticle);
    const insertSuccess = result.affectedRows === 1;
    const insertId = result.insertId;

    this.ctx.body = {
      isScuccess: insertSuccess,
      insertId,
    };
  }

  async getArticleById() {
    const id = this.ctx.params.id;

    const sql = 'SELECT article.id as id,' +
    'article.title as title,' +
    'article.introduce as introduce,' +
    "FROM_UNIXTIME(article.addTime,'%Y-%m-%d %H:%i:%s') as addTime," +
    'article.view_count as view_count,' +
    'article.article_content as content, ' +
    'type.typeName as typeName,' +
    'type.id as typeId ' +
    'FROM article LEFT JOIN type on article.type_id = type.id ' +
    'WHERE article.id=' + id;

    const results = await this.app.mysql.query(sql);

    this.ctx.body = {
      data: results,
    };
  }

  async getArticleList() {
    const sql = 'SELECT article.id as id,' +
    'article.title as title,' +
    'article.introduce as introduce,' +
    "FROM_UNIXTIME(article.addTime,'%Y-%m-%d %H:%i:%s') as addTime," +
    'article.view_count as view_count,' +
    'type.typeName as typeName FROM article LEFT JOIN type ON article.type_id = type.id';
    const results = await this.app.mysql.query(sql);

    this.ctx.body = {
      data: results,
    };
  }

  async deleteArticle() {
    const id = this.ctx.params.id;
    const res = await this.app.mysql.delete('article', { id });
    this.ctx.body = { data: res, id };
  }
}

module.exports = MainController;
