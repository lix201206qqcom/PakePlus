window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// PakePlus 注入脚本
// 作用：点击链接或按钮时，弹出新窗口，而不是在当前页跳转

// 需要过滤掉的按钮文字（内部操作，不弹窗）
var SKIP_TEXTS = ['返回', '关闭', '取消', '确认', '删除', '重命名', '复制', '移动', '新建', '上传', '刷新', '退出', '登录', '设置', '刷新', '×', '✕', '←'];

function shouldSkip(el){
    if(!el) return false;
    var text = (el.innerText || el.textContent || el.getAttribute('aria-label') || el.title || '').trim();
    for(var i = 0; i < SKIP_TEXTS.length; i++){
        if(text === SKIP_TEXTS[i] || text.indexOf(SKIP_TEXTS[i]) === 0) return true;
    }
    return false;
}

var hookClick = function(e){
    var el = e.target.closest('a, button');
    if(!el) return;
    if(shouldSkip(el)) return;

    // <a> 的情况
    if(el.tagName === 'A'){
        if(!el.href) return;
        var rawHref = el.getAttribute('href');
        if(rawHref && rawHref.charAt(0) === '#') return;
        if(el.href.indexOf('javascript:') === 0) return;
        if(el.href === location.href) return;
        e.preventDefault();
        console.log('open new window (a):', el.href);
        window.open(el.href, '_blank');
        return;
    }

    // <button> 的情况
    if(el.tagName === 'BUTTON'){
        // 如果按钮里有 data-href 或 data-url，优先用
        var href = el.getAttribute('data-href') || el.getAttribute('data-url') || el.getAttribute('data-link');
        if(href){
            e.preventDefault();
            console.log('open new window (btn data-href):', href);
            window.open(href, '_blank');
            return;
        }
        // 如果按钮本身有 value 指向 URL
        var val = el.getAttribute('value');
        if(val && /^https?:\/\//.test(val)){
            e.preventDefault();
            console.log('open new window (btn value):', val);
            window.open(val, '_blank');
            return;
        }
        // 其他按钮不处理，让网盘自己的逻辑跑
    }
};

document.addEventListener('click', hookClick, { capture: true });