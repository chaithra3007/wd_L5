"use strict";
const { Model , Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(para) {
      return await Todo.create(para);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      const overdueitems=await Todo.overdue();
      const todolist=overdueitems.map(todos => todos.displayableString()).join("\n");
      console.log(todolist);
      console.log("\n");

      console.log("Due Today");
      const duetodayitems=await Todo.dueToday();
      const todolist1=duetodayitems.map(todos => todos.displayableString()).join("\n");
      console.log(todolist1);
      console.log("\n");

      console.log("Due Later");
      const duelateritems=await Todo.dueLater();
      const todolist2=duelateritems.map(todos => todos.displayableString()).join("\n");
      console.log(todolist2);
    }

    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS
     const today=new Date();
      return Todo.findAll({
        where:{
          dueDate:{
            [Op.lt]:today,
          },
        },
        order:[
          ['id','ASC']
        ],
      });
    }

    static async dueToday() {
      const today=new Date();
      return Todo.findAll({
        where:{
          dueDate:{
            [Op.eq]:today,
          },
        },
        order:[
          ['id','ASC']
        ],
      });
    }

    static async dueLater() {
     const today=new Date();
      return Todo.findAll({
        where:{
          dueDate:{
            [Op.gt]:today,
          },
        },
        order:[
          ['id','ASC']
        ],
      });
    }
    
    static async markAsComplete(id) {
      return Todo.update(
        { completed: true },
        {
          where: {
            id: id,
          },
        }
      );
    }

    displayableString() {
      let checkbox = this.completed?"[x]" : "[ ]";
      return `${this.id}. ${checkbox} ${this.title} ${
        this.dueDate == new Date().toLocaleDateString("en-CA")
          ? ''
          : this.dueDate
      }`.trim();
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
