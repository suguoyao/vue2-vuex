<template>
  <div>
    <input type="file" class="camera" @change="uploader">
  </div>
</template>
<style scoped>
  .camera {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: 10;
  }
</style>
<script>
  import Exif from 'exif-js'
  import axios from 'axios'

  export default {
    name: 'scan',
    data() {
      return {}
    },
    methods: {
//      ...mapActions(['getScanResult']),
      uploader(e) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        this.picValue = files[0];
        this.imgPreview(this.picValue);
      },
      imgPreview(file) {
//        this.scanCard(file)
        let self = this;
        /*let Orientation;
        //去获取拍照时的信息，解决拍出来的照片旋转问题
        Exif.getData(file, function () {
          Orientation = Exif.getTag(this, 'Orientation');
        });*/

        // 看支持不支持FileReader
        if (!file || !window.FileReader) return;

        if (/^image/.test(file.type)) {
          // 创建一个reader
          let reader = new FileReader();
          // 将图片2将转成 base64 格式
//          reader.readAsDataURL(file);
          // 读取成功后的回调
          reader.onload = function () {
//            let result = this.result;
//            let img = new Image();
//            img.src = result;

            //判断图片是否小于500K,是就直接上传，反之压缩图片
            if (this.result.length <= (500 * 1024)) {
              //console.log('data1', this.result);

//              self.$store.dispatch('getScanResult', {file: file, that: this})
            } else {

//              self.$store.dispatch('getScanResult', {file: file, that: this})
            }
          }
          self.$store.dispatch('getScanResult', {file: file, that: this})
        }
      },
      compress(img, Orientation) {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext('2d');
        //瓦片canvas
        let tCanvas = document.createElement("canvas");
        let tctx = tCanvas.getContext("2d");
        let initSize = img.src.length;
        let width = img.width;
        let height = img.height;
        //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
        let ratio;
        if ((ratio = width * height / 4000000) > 1) {
          console.log("大于400万像素")
          ratio = Math.sqrt(ratio);
          width /= ratio;
          height /= ratio;
        } else {
          ratio = 1;
        }
        canvas.width = width;
        canvas.height = height;
        //        铺底色
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //如果图片像素大于100万则使用瓦片绘制
        let count;
        if ((count = width * height / 1000000) > 1) {
          console.log("超过100W像素");
          count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
          //            计算每块瓦片的宽和高
          let nw = ~~(width / count);
          let nh = ~~(height / count);
          tCanvas.width = nw;
          tCanvas.height = nh;
          for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
              tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
              ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
            }
          }
        } else {
          ctx.drawImage(img, 0, 0, width, height);
        }
        //修复ios上传图片的时候 被旋转的问题
        if (Orientation != "" && Orientation != 1) {
          switch (Orientation) {
            case 6://需要顺时针（向左）90度旋转
              this.rotateImg(img, 'left', canvas);
              break;
            case 8://需要逆时针（向右）90度旋转
              this.rotateImg(img, 'right', canvas);
              break;
            case 3://需要180度旋转
              this.rotateImg(img, 'right', canvas);//转两次
              this.rotateImg(img, 'right', canvas);
              break;
          }
        }
        //进行最小压缩
        let ndata = canvas.toDataURL('image/jpeg', 0.1);
        console.log('压缩前：' + initSize);
        console.log('压缩后：' + ndata.length);
        console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
        tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
        return ndata;
      },
      scanCard: async (file) => {
        await axios({
          url: 'https://netocr.com/api/recog.do',
          method: 'post',
          data: {
            file: file,
//            img: file,
            key: 'CuJSU2hs3ex2cQ39KzXpsC',
            secret: '5af14827d6854a82a397009d928d33cc',
            typeId: 20,
            format: 'json'
          },
          transformRequest: [function (data) {
            // Do whatever you want to transform the data
            var ret = new FormData();
            ret.append('file', data.file);
//            ret.append('img', data.img);
            ret.append('key', data.key);
            ret.append('secret', data.secret);
            ret.append('typeId', data.typeId);
            ret.append('format', data.format);
            return ret
          }],
          headers: {
//            'Content-Type': 'multipart/form-data'
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res) => {
          console.log('scan result', res);
        });
      }
    }
  }
</script>
