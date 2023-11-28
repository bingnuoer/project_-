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
          <td data-id="${item.id}">
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

// 目标2：点击保存按钮，获取表单数据 提交服务器，隐藏弹框
// 2.1 获取弹框
const addModalDemo = document.querySelector('.add-modal')
// 创建弹框对象
const addModal = new bootstrap.Modal(addModalDemo)

// “保存按钮”点击事件
document.querySelector('.add-btn').addEventListener('click', () => {
    // 2.2 获取表单数据 提交服务器
    const addForm = document.querySelector('.add-form')
    const bookObj = serialize(addForm, { hash: true, empty: true })
    console.log(bookObj);

    // 提交服务器
    axios({
        url: 'http://hmajax.itheima.net/api/books',
        method: 'POST',
        data: {
            // 对象的展开运算符
            ...bookObj,
            creator
        }
    }).then(result => {
        console.log(result);
        //2.3 重新获取并渲染图书列表
        getBookList()

        // 修改bug,置空表单（表单内置函数reset）
        addForm.reset()
        // 隐藏弹框
        addModal.hide()
    })


})

// 目标3.删除图书
// 3.1 删除元素的点击事件->获取图书id（获取 动态渲染的元素，用“事件委托-父级”）
// 3.2 调用删除接口
// 3.3 重新渲染表单
document.querySelector('.list').addEventListener('click', e => {
    // 如果e.target对象里面包含“删除”按钮
    if (e.target.classList.contains('del')) {
        // 3.1 获取删除图书id(自定义属性)
        // parentNode表示该元素的父节点。所以e.target.parentNode表示“删除”按钮的父节点
        // dataset是DOM元素的属性，它可以用来获取或设置自定义属性。在这里，dataset.id表示该元素的data-id属性的值，即图书的id
        const theId = e.target.parentNode.dataset.id
        console.log(theId);

        // 3.2 调用删除接口
        axios({
            // url路径传参
            url:`http://hmajax.itheima.net/api/books/${theId}`,
            method:'DELETE',
        }).then(result => {
            // 删除图书成功
            console.log(result);
            // 3.3 重新获取并渲染图书列表
            getBookList()
        })
    }

})

// 目标4.编辑图书
// 4.1 编辑弹框 -> 显示和隐藏（有逻辑-Js控制）
// 4.2 获取当前编辑图书数据 -> 回显到编辑表单中
// 4.3 提交保存修改，并刷新列表

// 获取弹框
const editDemo = document.querySelector('.edit-modal')
const editMadal = new bootstrap.Modal(editDemo)
// 获取编辑按钮
document.querySelector('.list').addEventListener('click',e => {
    if(e.target.classList.contains = 'edit'){
        // console.log('编辑');
        // 显示弹框
        editMadal.show()
        // 回显表单数据

    }
})
// 点击修改按钮 -> 获取当前编辑图书数据 -> 隐藏弹框
document.querySelector('.edit-btn').addEventListener('click',() => {
    // 隐藏弹框
    editMadal.hide()
})


