<template>
    <!-- <action-sheet  v-model="show" title="奖励说明" @click-overlay="closeFun" @close="closeFun"> -->
		<sd-action-sheet v-model="show" title='奖励说明' @close="closeFun">
			<div class="rule-wrap ">
				<div class="head-wrap">
					<p>推广奖励:<span>{{earnPrice}} 元</span></p>
					<p v-if="invitePrice">邀请奖励:<span>{{invitePrice}} 元</span></p>
				</div>
				<ul class="rule-list">
					<li class="rule-item">
							<h4>推广奖励</h4>
							<p>游客通过你分享的海报或链接地址访问指定产品详情页进行购买，核销完成后，你可以获得奖励</p>
					</li>
					<li class="rule-item">
							<h4>邀请奖励</h4>
							<p>邀请好友成为推广员后，当他推广指定产品成功时，他可以获得推广奖励，你可以获得邀请奖励</p>
					</li>
					<li class="rule-item">
							<h4>奖励提现</h4>
							<p>奖励的佣金在游客核销后到账，具体金额以最后结算为准，次日可进行提现。</p>
					</li>
        </ul>
			</div>
    </sd-action-sheet>
</template>

<script>
import SdActionSheet from './actionSheet.vue'
export default {
  components: {SdActionSheet},
  props: {
    show: {
		type: Boolean,
		default: false,
	},
	earnPrice:{
		type:Number,
		default:0
	},
	invitePrice:{
		type:Number,
		default:0
	}
  },
  data() {
    return {

    };
  },
  watch: {
	},
  computed: {},
  methods: {
	  closeFun(){
		  this.$emit('update:show',false)
	  }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="less" >
.rule-wrap{
	max-height:488px;
	overflow: auto;
	padding-left: 10px;
	font-size: 13px;
	.head-wrap{
		position: relative;
		display: flex;
		justify-content: space-between;
		height:53px;
		line-height: 53px;
		color:#413838;
		padding:0 21px 0 11px;
		p{
			span{
				padding-left:10px;
				color:#ff6600;
			}
		}
		&:after{
			position: absolute;
			box-sizing: border-box;
			content: ' ';
			pointer-events: none;
			right: 10px;
			bottom: 0;
			left: 0;
			border-bottom: 1px solid #e1e1e1;
			transform: scaleY(0.5);
		}
	}
	.rule-list{
		padding-top:10px;
		.rule-item{
			h4{
				height: 37px;
				line-height: 37px;
				font-weight: bold;
				background-color: #f8f8f8;
			}
			p{
				padding:13px 5px 16px 15px;
				line-height: 22px;
				color:#413838;
			}
		}
		
	}
}
</style>