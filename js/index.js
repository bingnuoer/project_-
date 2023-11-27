/**
 * 目标1：渲染图书列表
 *  1.1 获取数据
 *  1.2 渲染数据
 */
// 不需要导入axios发请求
// import axios from '../lib/axios'
// 封装 “获取和渲染” 图书列表
const creator = '老李'
function getBookList() {
    // 1、获取
    axios({
        url: 'http://hmajax.itheima.net/api/books',
        params: {
            // 外号：获取对应的数据
            creator
        }
    }).then(result => {
        // console.log(result.data.data);
        const bookList = result.data.data
        console.log(bookList);

        // 2、渲染数据
        // 遍历数组映射标签
        const htmlStr = bookList.map((item, index) => {
            return `
        <tr>
          <td>${index + 1}</td>
          <td>${item.bookname}</td>
          <td>${item.author}</td>
          <td>${item.publisher}</td>
          <td>
            <span class="del">删除</span>
            <span class="edit">编辑</span>
          </td>
        </tr>
        `
        }).join('')
        console.log(htmlStr);
        document.querySelector('.list').innerHTML = htmlStr
    })

}
// 网页加载运行，获取并渲染图书列表
getBookList()
