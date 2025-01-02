<template>
  <div>
    <editor id="tiny-editor" api-key="no-api-key" v-model="content" :init="init"
      tinymceScriptSrc="/tinymce/tinymce.min.js"/>
  </div>
</template>

<script setup>
import Editor from '@tinymce/tinymce-vue'
// import 'tinymce/icons/default'; //引入编辑器图标icon，不引入则不显示对应图标

import { ref, onMounted, watch } from "vue"
// import { uploadImage } from '@/api/admin'

const props = defineProps({
  modelValue: String,
  readonly: Boolean
});
const emit = defineEmits(["update:modelValue"]);

const content = ref('')
const editorRef = ref(null)

const init = ref({
  selector: "#tiny-editor",
  auto_focus: true,
  readonly: true,
  disabled: true,
  height: 500,
  language: 'zh_CN',//注意大小写
  //全部插件 plugins: 'print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help emoticons autosave bdmap indent2em autoresize  axupimgs  kityformula-editor',
  //autoresize 会导致设置的高度失效
  plugins: 'print paste preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help emoticons autosave',
  // 全部toolbar
  // toolbar: "code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | bullist numlist |\
  //              styleselect formatselect fontselect fontsizeselect | blockquote subscript superscript removeformat | \
  //              table image media charmap emoticons hr pagebreak print preview | fullscreen | bdmap indent2em lineheight formatpainter axupimgs importword kityformula-editor",
  toolbar: "code undo redo restoredraft | cut copy | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | bullist numlist |  blockquote subscript superscript removeformat | \
                     formatselect | fontselect | fontsizeselect |\
                     table image media charmap emoticons hr pagebreak print preview | fullscreen | lineheight formatpainter",
  // axupimgs: 多图上传插件
  // content_style:
  //   "body { font-family:微软雅黑=Microsoft YaHei,Arial,sans-serif; font-size:16px }",
  fontsize_formats: '12px 14px 16px 18px 24px 36px 48px',
  font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats;知乎配置=BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif;小米配置=Helvetica Neue,Helvetica,Arial,Microsoft Yahei,Hiragino Sans GB,Heiti SC,WenQuanYi Micro Hei,sans-serif',

  // template_cdate_format: '[CDATE: %m/%d/%Y : %H:%M:%S]',
  // template_mdate_format: '[MDATE: %m/%d/%Y : %H:%M:%S]',
  autosave_ask_before_unload: false,
  toolbar_mode: 'wrap', // 工具栏换行
  branding: false, // 去除商标
  promotion: false, // 去除右上角upgrade
  paste_data_images: true, // 允许粘贴图片
  paste_enable_default_filters: false,  // 开启默认过滤器,保留word样式
  // toolbar_sticky: true, // 工具栏sticky
  paste_remove_styles_if_webkit: false,
  image_advtab: true, // 图片保存style属性
  image_dimensions: true, // 开启图片宽高设置 ?? 图片高级设置
  relative_urls: false,
  remove_script_host: true,
  paste_merge_formats: true, // 粘贴合并相似格式，例：<b>abc <b>bold</b> 123</b> 转换为 <b>abc bold 123</b>
  paste_word_valid_elements: "*[*]", // 从Word粘贴过来时，不会对此处配置的内容进行过滤（需要paste_enable_default_filters为true才生效）
  paste_retain_style_properties: "all", // 从Word粘贴过来时，将保留此处配置的样式
  paste_webkit_styles: "all", // 在WebKit中粘贴时，将保留此处配置的样式
  media_alt_source: false, // 去除上传视频的备用地址
  images_upload_handler: function (blobInfo, succFun, failFun) {
    let formData = new FormData();
    let file = blobInfo.blob();
    formData.append('file', file, file.name);
    // uploadImage(formData).then((res) => {
    //   if (res.url) {
    //     succFun(import.meta.env.VITE_APP_BASE_AGENT_DOWNLOAD_API + res.url);
    //   }
    // });
  },
  file_picker_types: "image media",  // 去掉file, 否则添加外链的弹窗也会有上传按钮
  file_picker_callback: function (callback, value, meta) {
    let input = document.createElement('input');//创建一个隐藏的input
    if (meta.filetype === 'media') {
      input.setAttribute('accept', '.mp4,.avi,.swf,.mpeg')
    } else if (meta.filetype === 'image') {
      input.setAttribute('accept', '.jpg,.jpeg,.png,.gif,.bmp')
    }
    input.setAttribute('type', 'file')
    input.onchange = function (e) {
      console.log('val: ', e.target.files);
      const file = e.target.files[0]
      let formData = new FormData();
      formData.append('file', file, file.name);
      // uploadImage(formData).then((res) => {
      //   console.log('res: ', res);
      //   if (res.url) {
      //     callback(import.meta.env.VITE_APP_BASE_AGENT_DOWNLOAD_API + res.url);
      //   }
      // });
    }
    input.click();
  },
  paste_preprocess: function (plugin, args) {  // 从Word粘贴过来时，被插入到编辑器之前的文本
    args.content = args.content.replace(/([+-]?[0-9]*\.?[0-9]+)pt/g, function (match, group0) {  //将pt统一转为px，包括负数值（-10px这种）
      return Math.abs(Math.round(parseInt(group0, 10) * 96 / 72)) + "px";
    })
  },
  setup: (editor) => {
    editor.on('init', function (e) {
      // _this.changeHandler()
      editorInit(editor)
    })

  },
})

const editorInit = (editor) => {
  editorRef.value = editor
  setTimeout(() => {
    if (props.readonly) {
      editor.setMode('readonly')
    } else {
      editor.setMode('design')  // 激活
    }
  }, 500)
}

watch(() => props.modelValue, (newVal, oldVal) => {
  content.value = newVal
}, {
  immediate: true,
  deep: true,
}
);

watch(() => content.value, (newVal, oldVal) => {
  console.log('newVal: ', newVal);
  emit("update:modelValue", newVal);
});

</script>

<style scoped></style>
