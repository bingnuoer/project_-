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
        // console.log(bookList);

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
        // console.log(htmlStr);
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
            url: `http://hmajax.itheima.net/api/books/${theId}`,
            method: 'DELETE',
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
document.querySelector('.list').addEventListener('click', e => {
    if (e.target.classList.contains = 'edit') {
        // console.log('编辑');
        // 显示弹框
        editMadal.show()

        // 获取图书id => 回显到弹框
        const theId = e.target.parentNode.dataset.id
        // console.log(theId);
        // 4.2 回显表单数据
        // 发送请求，获取本行id对应的图书数据
        axios({
            url: `http://hmajax.itheima.net/api/books/${theId}`
        }).then(result => {
            // console.log(result.data.data);
            const bookObj = result.data.data
            // 法一：弹框表单回显 -页面获取文本框元素设置值
            // document.querySelector('.edit-modal .bookname').value=bookObj.bookname
            // document.querySelector('.edit-modal .author' ).value = bookObj.author

            // 法二：图书对象数据转换成数组，循环回显
            const keys = Object.keys(bookObj)
            console.log(keys); // ['id', 'bookname', 'author', 'publisher']
            // key是数组中每个元素,[key]是数组中每个元素的值
            keys.forEach(key => {
                // 遍历属性，通过属性和类名的关系，快速把数据回显
                // 循环把类名设置到获取文本框元素 并 赋值
                document.querySelector(`.edit-modal .${key}`).value = bookObj[key]
            })
        })
    }
})
// 4.3 点击修改按钮 -> 获取当前编辑图书数据 -> 隐藏弹框
document.querySelector('.edit-btn').addEventListener('click', () => {
    // 获取当前编辑后的 弹框图书数据
    // 获取表单
    const editForm = document.querySelector('.edit-form')
    // 获取修改后表单数据
    // const bookObj = new serialize(editForm, { hash: true, empty: true })
    // const bookObj = new serialize(editForm, { hash: true, empty: true })
    const { id, author, bookname, publisher } = new serialize(editForm, { hash: true, empty: true })
    // 隐藏存id的表单，防止用户修改
    // <input type="hidden" class="id" name="id" value="311244">
    // console.log(bookObj);
    // const theId = bookObj.id
    // console.log(theId);

    // 提交到服务器
    axios({
        url: `http://hmajax.itheima.net/api/books/${id}`,
        method: 'PUT',
        data: {
            // ...bookObj,
            bookname: bookname,
            author: author,
            publisher: publisher,
            creator
        }
    }).then(result => {
        // console.log(result);
        // 修改成功
        console.log(result.data.data);
        // 渲染表格 网页加载运行，重新获取并渲染图书列表
        getBookList()
        // 隐藏弹框
        editMadal.hide()
    })

})


