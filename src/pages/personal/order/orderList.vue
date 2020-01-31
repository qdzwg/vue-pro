<template>
    <div class="order-list" :style="{'padding-bottom':tabContentHeight+'px'}">
        <div class='state-ul bg-w boxshadow m-b-10'>
            <div class="state-li" :class='{active:currentindex=="0"}' @click="select('all',0)">
                <div class="state-title">全部订单</div>
            </div>
            <div class="state-li" :class='{active:currentindex=="1"}' @click="select('WAIT_PAY',1)">
                <div class="state-title">待付款</div>
            </div>
            <div class="state-li" :class='{active:currentindex=="2"}' @click="select('WAIT_CONSUME',2)">
                <div class="state-title">待消费</div>
            </div>
            <div class="state-li" :class='{active:currentindex=="3"}' @click="select('FINISH',3)">
                <div class="state-title">已完成</div>
            </div>
            <div class="state-li" :class='{active:currentindex=="4"}' @click="select('REFUNDING',4)">
                <div class="state-title">售后</div>
            </div>
        </div>
        <swiper v-model="currentindex" ref="swiper" :show-dots="false" class="state-content" @on-index-change="switchTab">
            <swiper-item>
                <!-- {{listData[0].length}} -->
                <scroll :data="listData[0]" :pullup="pullup" @scrollToEnd="getBottom(0)" class="content-item">
                    <div v-if='listData[0].length' class="item-ul">
                        <div v-for='(it,i) in listData[0]' :key='i' @click="goUrl((activestate=='WAIT_PAY'?'payOrderNo':'orderno')+'='+(activestate=='WAIT_PAY'?it.payOrderNo:it.id))" class="waitpay m-b-10 boxshadow bg-w">
                            <!-- 其他订单 -->
                            <div class="orderdate">
                                <span class="text">下单日期:</span>
                                <span class="date">{{it.createTime}}</span>
                                <span v-if="activestate=='all'" class="fr state">{{it.stateName}}</span>
                            </div>
                            <div class="waitpay-info">
                                <img v-if="it.orderDetail&&it.orderDetail.length&&it.orderDetail[0].linkImg&&it.orderType=='eatery'" class="img" :src="it.orderDetail[0].linkImg" alt="">
                                <img v-else-if='it.orderDetail&&it.orderDetail.length&&it.orderDetail[0].linkMobileImg' class="img" :src="it.orderDetail[0].linkMobileImg" alt="">

                                <img v-else src="http://statics.lotsmall.cn/wx/img/lose.png" class="img" alt="">
                                <div class="info">
                                    <div class="two-line info-text">
                                        {{it.nickName}}
                                    </div>
                                    <div class="spec-price clearfix">
                                        <!-- 商品 -->
                                        <div v-if="it.orderType=='mdse'" class="spec-list spec-list fl">
                                            <span class="spec-item" v-for='(specStr,specIndex) in it.specArr' :key='specIndex'>{{specStr}}</span>
                                        </div>
                                        <!-- 门票 -->
                                        <div v-if="it.orderType=='park'" class="spec-list fl clearfix">
                                            <div class="spec-list fl">
                                                <span class="spec-item">游玩时间:{{it.startTime}}</span>
                                            </div>
                                        </div>
                                        <!-- 酒店 -->
                                        <div v-if="it.orderType=='hotel'" class="spec-list fl clearfix">
                                            <div class="spec-list">
                                                <span class="spec-item">入住时间:{{it.startTime}}</span>
                                            </div>
                                            <div class="spec-list" style="margin-top:10rpx">
                                                <span class="spec-item">离店时间:{{it.endTime}}</span>
                                            </div>
                                        </div>
                                        <div class="price-info fr">
                                            <div class="price">￥{{it.price||it.settleSum}}</div>
                                            <div class="num clearfix">
                                                <span class='fr'>{{it.amount}}</span>
                                                <span class="unit fr">x</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="pay">
                                    <div class="pay-money">
                                        <span class="text">支付金额:</span>
                                        <span>￥{{it.paySum}}</span>
                                    </div>
                                    <div class="clearfix">
                                        <!-- 当前单个业态共有的状态提取 -->
                                        <!-- 退款中 -->

                                        <!-- 酒店 -->
                                        <template v-if="it.orderType=='hotel'">
                                            <!-- <div v-if="it.orderStatus=='5'" @click.stop="delOrder(it.orderNo)" class="order-btn cancel-btn">
                          删除订单
                        </div> -->
                                            <!-- 待消费 -->
                                            <template v-if="it.orderStatus=='3'">
                                                <!-- <div @click.stop="goUrl('pages/member/order/detail/main?orderno=' + it.id)" class="order-btn cancel-btn fl">
                            申请退款
                          </div> -->
                                                <div @click="goUrl('orderno=' + it.id)" class="order-btn red-btn fr">
                                                    查看详情
                                                </div>
                                            </template>
                                        </template>

                                        <!-- 门票 -->
                                        <template v-if="it.orderType=='park'">
                                            <!-- 已关闭 -->
                                            <!-- <div v-if="it.orderStatus=='5'" @click.stop="delOrder(it.orderNo)" class="order-btn cancel-btn">
                          删除订单
                        </div> -->
                                            <!-- 待消费 -->
                                            <template v-if="it.orderStatus=='3'">
                                                <!-- <div @click.stop="goUrl('pages/member/order/detail/main?orderno=' + it.id)" class="order-btn cancel-btn fl">
                            申请退款
                          </div> -->
                                                <div @click="goUrl('orderno=' + it.id)" class="order-btn red-btn fr">
                                                    查看详情
                                                </div>
                                            </template>
                                        </template>

                                        <!-- 商品 -->
                                        <template v-if="it.orderType=='mdse'">
                                            <!-- 已关闭 -->
                                            <!-- <div v-if="it.orderStatus=='5'" @click.stop="delOrder(it.orderNo)" class="order-btn cancel-btn">
                          删除订单
                        </div> -->
                                            <div v-if="it.orderStatus=='6'" @click.stop="goUrl('orderno=' + it.orderNo+'&orderInfoId='+ it.id)" class="order-btn red-btn fr">
                                                退单详情
                                            </div>
                                            <!-- 已完成 -->
                                            <!-- <template v-if="it.orderStatus=='4'">
                          <div @click.stop="delOrder(it.orderNo)" class="order-btn cancel-btn">
                            发表评价
                          </div>
                          <div @click.stop="delOrder(it.orderNo)" class="order-btn cancel-btn">
                            查看二维码
                          </div>
                        </template> -->
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="no-data" v-else>暂无数据</div>
                </scroll>
            </swiper-item>
            <swiper-item v-model="currentindex">
                <scroll :data="listData[1]" :pullup="pullup" @scrollToEnd='getBottom(1)' class="content-item">
                    <div v-if='listData[1].length' class="item-ul">
                        <div v-for='(it,i) in listData[1]' :key='i' @click="goUrl((activestate=='WAIT_PAY'?'payOrderNo':'orderno')+'='+(activestate=='WAIT_PAY'?it.payOrderNo:it.id))" class="waitpay m-b-10 boxshadow bg-w">
                            <!-- 待付款订单 -->
                            <div class="orderdate">
                                <span class="text">下单日期:</span>
                                <span class="date">{{it.orderTime}}</span>
                            </div>
                            <div class="waitpay-info">
                                <div class="waitpay-info-item" v-for='(el,sort) in it.orderDetailVoList' :key='sort'>
                                    <img v-if="el.linkImg&&el.orderType=='eatery'" class="img" :src="el.linkImg" alt="">
                                    <img v-else-if="el.linkMobileImg" class="img" :src="el.linkMobileImg" alt="">
                                    <img v-else src="http://statics.lotsmall.cn/wx/img/lose.png" class="img" alt="">
                                    <div class="info">
                                        <div class="two-line info-text">
                                            {{el.orderInfo}}
                                        </div>
                                        <div class="spec-price clearfix">
                                            <!-- 商品 -->
                                            <div v-if="el.orderType=='mdse'" class="spec-list fl">
                                                <span v-for='(specStr,specIndex) in el.specArr' :key='specIndex' class="spec-item">{{specStr}}</span>
                                                <!-- <span v-for='' class="spec-item">规格一</span>
                          <span class="spec-item">规格一</span> -->
                                            </div>
                                            <!-- 门票 -->
                                            <div v-if="el.orderType=='park'" class="spec-list fl clearfix">
                                                <div class="spec-list fl">
                                                    <span class="spec-item">游玩时间:{{el.startTime}}</span>
                                                </div>
                                            </div>
                                            <!-- 酒店 -->
                                            <div v-if="el.orderType=='hotel'" class="spec-list fl clearfix">
                                                <div class="spec-list">
                                                    <span class="spec-item">入住时间:{{el.startTime}}</span>
                                                </div>
                                                <div class="spec-list" style="margin-top:10rpx">
                                                    <span class="spec-item">离店时间:{{el.endTime}}</span>
                                                </div>
                                            </div>
                                            <div class="price-info fr">
                                                <div class="price">￥{{el.price}}</div>
                                                <div class="num clearfix">
                                                    <span class='fr'>{{el.amount}}</span>
                                                    <span class="unit fr">x</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="pay">
                                    <div class="pay-money">
                                        <span class="text">支付金额:</span>
                                        <span>￥{{it.paySum}}</span>
                                    </div>
                                    <div class="clearfix">
                                        <div @click.stop="cancelOrder(it.payOrderNo,i)" class="order-btn cancel-btn fl">
                                            取消订单
                                        </div>
                                        <div @click.stop='openPaySure(it.paySum,it.payOrderNo,it.orderDescription,i)' class="order-btn red-btn fr">
                                            立即支付
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="no-data" v-else>暂无数据</div>
                </scroll>
            </swiper-item>
            <swiper-item v-model="currentindex">
                <!-- {{listData[0].length}} -->
                <scroll :data="listData[2]" :pullup="pullup" @scrollToEnd='getBottom(2)' class="content-item">
                    <div v-if='listData[2].length' class="item-ul">
                        <div v-for='(it,i) in listData[2]' :key='i' @click="goUrl((activestate=='WAIT_PAY'?'payOrderNo':'orderno')+'='+(activestate=='WAIT_PAY'?it.payOrderNo:it.id))" class="waitpay m-b-10 boxshadow bg-w">
                            <!-- 其他订单 -->
                            <div class="orderdate">
                                <span class="text">下单日期:</span>
                                <span class="date">{{it.createTime}}</span>
                                <span v-if="activestate=='all'" class="fr state">{{it.stateName}}</span>
                            </div>
                            <div class="waitpay-info">
                                <img v-if="it.orderDetail&&it.orderDetail.length&&it.orderDetail[0].linkImg&&it.orderType=='eatery'" class="img" :src="it.orderDetail[0].linkImg" alt="">
                                <img v-else-if='it.orderDetail&&it.orderDetail.length&&it.orderDetail[0].linkMobileImg' class="img" :src="it.orderDetail[0].linkMobileImg" alt="">
                                <img v-else src="http://statics.lotsmall.cn/wx/img/lose.png" class="img" alt="">
                                <div class="info">
                                    <div class="two-line info-text">
                                        {{it.nickName}}
                                    </div>
                                    <div class="spec-price clearfix">
                                        <!-- 商品 -->
                                        <div v-if="it.orderType=='mdse'" class="spec-list spec-list fl">
                                            <span class="spec-item" v-for='(specStr,specIndex) in it.specArr' :key='specIndex'>{{specStr}}</span>
                                        </div>
                                        <!-- 门票 -->
                                        <div v-if="it.orderType=='park'" class="spec-list fl clearfix">
                                            <div class="spec-list fl">
                                                <span class="spec-item">游玩时间:{{it.startTime}}</span>
                                            </div>
                                        </div>
                                        <!-- 酒店 -->
                                        <div v-if="it.orderType=='hotel'" class="spec-list fl clearfix">
                                            <div class="spec-list">
                                                <span class="spec-item">入住时间:{{it.startTime}}</span>
                                            </div>
                                            <div class="spec-list" style="margin-top:10rpx">
                                                <span class="spec-item">离店时间:{{it.endTime}}</span>
                                            </div>
                                        </div>
                                        <div class="price-info fr">
                                            <div class="price">￥{{it.price}}</div>
                                            <div class="num clearfix">
                                                <span class='fr'>{{it.amount}}</span>
                                                <span class="unit fr">x</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="pay">
                                    <div class="pay-money">
                                        <span class="text">支付金额:</span>
                                        <span>￥{{it.paySum}}</span>
                                    </div>
                                    <div class="clearfix">
                                        <!-- 当前单个业态共有的状态提取 -->
                                        <!-- 退款中 -->

                                        <!-- 酒店 -->
                                        <template v-if="it.orderType=='hotel'">
                                            <!-- <div v-if="it.orderStatus=='5'" @click.stop="delOrder(it.orderNo)" class="order-btn cancel-btn">
                          删除订单
                        </div> -->
                                            <!-- 待消费 -->
                                            <template v-if="it.orderStatus=='3'">
                                                <!-- <div @click.stop="goUrl('pages/member/order/detail/main?orderno=' + it.id)" class="order-btn cancel-btn fl">
                            申请退款
                          </div> -->
                                                <div @click="goUrl('orderno=' + it.id)" class="order-btn red-btn fr">
                                                    查看详情
                                                </div>
                                            </template>
                                        </template>

                                        <!-- 门票 -->
                                        <template v-if="it.orderType=='park'">
                                            <!-- 已关闭 -->
                                            <!-- <div v-if="it.orderStatus=='5'" @click.stop="delOrder(it.orderNo)" class="order-btn cancel-btn">
                          删除订单
                        </div> -->
                                            <!-- 待消费 -->
                                            <template v-if="it.orderStatus=='3'">
                                                <!-- <div @click.stop="goUrl('pages/member/order/detail/main?orderno=' + it.id)" class="order-btn cancel-btn fl">
                            申请退款
                          </div> -->
                                                <div @click="goUrl('orderno=' + it.id)" class="order-btn red-btn fr">
                                                    查看详情
                                                </div>
                                            </template>
                                        </template>

                                        <!-- 商品 -->
                                        <template v-if="it.orderType=='mdse'">
                                            <!-- 已关闭 -->
                                            <!-- <div v-if="it.orderStatus=='5'" @click.stop="delOrder(it.orderNo)" class="order-btn cancel-btn">
                          删除订单
                        </div> -->
                                            <div v-if="it.orderStatus=='6'" @click.stop="goUrl('orderno=' + it.orderNo+'&orderInfoId='+ it.id)" class="order-btn red-btn fr">
                                                退单详情
                                            </div>
                                            <!-- 已完成 -->
                                            <!-- <template v-if="it.orderStatus=='4'">
                          <div @click.stop="delOrder(it.orderNo)" class="order-btn cancel-btn">
                            发表评价
                          </div>
                          <div @click.stop="delOrder(it.orderNo)" class="order-btn cancel-btn">
                            查看二维码
                          </div>
                        </template> -->
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="no-data" v-else>暂无数据</div>
                </scroll>
            </swiper-item>
            <swiper-item v-model="currentindex">
                <!-- {{listData[0].length}} -->
                <scroll :data="listData[3]" :pullup="pullup" @scrollToEnd='getBottom(3)' class="content-item">
                    <div v-if='listData[3].length' class="item-ul">
                        <div v-for='(it,i) in listData[3]' :key='i' @click="goUrl((activestate=='WAIT_PAY'?'payOrderNo':'orderno')+'='+(activestate=='WAIT_PAY'?it.payOrderNo:it.id))" class="waitpay m-b-10 boxshadow bg-w">
                            <!-- 其他订单 -->
                            <div class="orderdate">
                                <span class="text">下单日期:</span>
                                <span class="date">{{it.createTime}}</span>
                                <span v-if="activestate=='all'" class="fr state">{{it.stateName}}</span>
                            </div>
                            <div class="waitpay-info">
                                <img v-if="it.orderDetail&&it.orderDetail.length&&it.orderDetail[0].linkImg&&it.orderType=='eatery'" class="img" :src="it.orderDetail[0].linkImg" alt="">
                                <img v-else-if='it.orderDetail&&it.orderDetail.length&&it.orderDetail[0].linkMobileImg' class="img" :src="it.orderDetail[0].linkMobileImg" alt="">
                                <img v-else src="http://statics.lotsmall.cn/wx/img/lose.png" class="img" alt="">
                                <div class="info">
                                    <div class="two-line info-text">
                                        {{it.nickName}}
                                    </div>
                                    <div class="spec-price clearfix">
                                        <!-- 商品 -->
                                        <div v-if="it.orderType=='mdse'" class="spec-list spec-list fl">
                                            <span class="spec-item" v-for='(specStr,specIndex) in it.specArr' :key='specIndex'>{{specStr}}</span>
                                        </div>
                                        <!-- 门票 -->
                                        <div v-if="it.orderType=='park'" class="spec-list fl clearfix">
                                            <div class="spec-list fl">
                                                <span class="spec-item">游玩时间:{{it.startTime}}</span>
                                            </div>
                                        </div>
                                        <!-- 酒店 -->
                                        <div v-if="it.orderType=='hotel'" class="spec-list fl clearfix">
                                            <div class="spec-list">
                                                <span class="spec-item">入住时间:{{it.startTime}}</span>
                                            </div>
                                            <div class="spec-list" style="margin-top:10rpx">
                                                <span class="spec-item">离店时间:{{it.endTime}}</span>
                                            </div>
                                        </div>
                                        <div class="price-info fr">
                                            <div class="price">￥{{it.price}}</div>
                                            <div class="num clearfix">
                                                <span class='fr'>{{it.amount}}</span>
                                                <span class="unit fr">x</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="pay">
                                    <div class="pay-money">
                                        <span class="text">支付金额:</span>
                                        <span>￥{{it.paySum}}</span>
                                    </div>
                                    <div class="clearfix">
                                        <!-- 当前单个业态共有的状态提取 -->
                                        <!-- 退款中 -->

                                        <!-- 酒店 -->
                                        <template v-if="it.orderType=='hotel'">
                                            <!-- <div v-if="it.orderStatus=='5'" @click.stop="delOrder(it.orderNo)" class="order-btn cancel-btn">
                          删除订单
                        </div> -->
                                            <!-- 待消费 -->
                                            <template v-if="it.orderStatus=='3'">
                                                <!-- <div @click.stop="goUrl('pages/member/order/detail/main?orderno=' + it.id)" class="order-btn cancel-btn fl">
                            申请退款
                          </div> -->
                                                <div @click="goUrl('orderno=' + it.id)" class="order-btn red-btn fr">
                                                    查看详情
                                                </div>
                                            </template>
                                        </template>

                                        <!-- 门票 -->
                                        <template v-if="it.orderType=='park'">
                                            <!-- 已关闭 -->
                                            <!-- <div v-if="it.orderStatus=='5'" @click.stop="delOrder(it.orderNo)" class="order-btn cancel-btn">
                          删除订单
                        </div> -->
                                            <!-- 待消费 -->
                                            <template v-if="it.orderStatus=='3'">
                                                <!-- <div @click.stop="goUrl('pages/member/order/detail/main?orderno=' + it.id)" class="order-btn cancel-btn fl">
                            申请退款
                          </div> -->
                                                <div @click="goUrl('orderno=' + it.id)" class="order-btn red-btn fr">
                                                    查看详情
                                                </div>
                                            </template>
                                        </template>

                                        <!-- 商品 -->
                                        <template v-if="it.orderType=='mdse'">
                                            <!-- 已关闭 -->
                                            <!-- <div v-if="it.orderStatus=='5'" @click.stop="delOrder(it.orderNo)" class="order-btn cancel-btn">
                          删除订单
                        </div> -->
                                            <div v-if="it.orderStatus=='6'" @click.stop="refundgoUrl('orderno=' + it.orderNo+'&orderInfoId='+ it.id)" class="order-btn red-btn fr">
                                                退单详情
                                            </div>
                                            <!-- 已完成 -->
                                            <!-- <template v-if="it.orderStatus=='4'">
                          <div @click.stop="delOrder(it.orderNo)" class="order-btn cancel-btn">
                            发表评价
                          </div>
                          <div @click.stop="delOrder(it.orderNo)" class="order-btn cancel-btn">
                            查看二维码
                          </div>
                        </template> -->
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="no-data" v-else>暂无数据</div>
                </scroll>
            </swiper-item>
            <swiper-item v-model="currentindex">
                <!-- {{listData[0].length}} -->
                <scroll :data="listData[4]" :pullup="pullup" @scrollToEnd='getBottom(4)' class="content-item">
                    <div v-if='listData[4].length' class="item-ul">
                        <div v-for='(it,i) in listData[4]' :key='i' @click="goUrl((activestate=='WAIT_PAY'?'payOrderNo':'orderno')+'='+(activestate=='WAIT_PAY'?it.payOrderNo:it.id))" class="waitpay m-b-10 boxshadow bg-w">
                            <!-- 其他订单 -->
                            <div class="orderdate">
                                <span class="text">下单日期:</span>
                                <span class="date">{{it.createTime}}</span>
                                <span v-if="activestate=='all'" class="fr state">{{it.stateName}}</span>
                            </div>
                            <div class="waitpay-info">
                                <img v-if="it.orderDetail&&it.orderDetail.length&&it.orderDetail[0].linkImg&&it.orderType=='eatery'" class="img" :src="it.orderDetail[0].linkImg" alt="">
                                <img v-else-if='it.orderDetail&&it.orderDetail.length&&it.orderDetail[0].linkMobileImg' class="img" :src="it.orderDetail[0].linkMobileImg" alt="">
                                <img v-else src="http://statics.lotsmall.cn/wx/img/lose.png" class="img" alt="">
                                <div class="info">
                                    <div class="two-line info-text">
                                        {{it.nickName}}
                                    </div>
                                    <div class="spec-price clearfix">
                                        <!-- 商品 -->
                                        <div v-if="it.orderType=='mdse'" class="spec-list spec-list fl">
                                            <span class="spec-item" v-for='(specStr,specIndex) in it.specArr' :key='specIndex'>{{specStr}}</span>
                                        </div>
                                        <!-- 门票 -->
                                        <div v-if="it.orderType=='park'" class="spec-list fl clearfix">
                                            <div class="spec-list fl">
                                                <span class="spec-item">游玩时间:{{it.startTime}}</span>
                                            </div>
                                        </div>
                                        <!-- 酒店 -->
                                        <div v-if="it.orderType=='hotel'" class="spec-list fl clearfix">
                                            <div class="spec-list">
                                                <span class="spec-item">入住时间:{{it.startTime}}</span>
                                            </div>
                                            <div class="spec-list" style="margin-top:10rpx">
                                                <span class="spec-item">离店时间:{{it.endTime}}</span>
                                            </div>
                                        </div>
                                        <div class="price-info fr">
                                            <div class="price">￥{{it.price}}</div>
                                            <div class="num clearfix">
                                                <span class='fr'>{{it.amount}}</span>
                                                <span class="unit fr">x</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="pay">
                                    <div class="pay-money">
                                        <span class="text">支付金额:</span>
                                        <span>￥{{it.paySum}}</span>
                                    </div>
                                    <div class="clearfix">
                                        <!-- 当前单个业态共有的状态提取 -->
                                        <!-- 退款中 -->

                                        <!-- 酒店 -->
                                        <template v-if="it.orderType=='hotel'">
                                            <!-- <div v-if="it.orderStatus=='5'" @click.stop="delOrder(it.orderNo)" class="order-btn cancel-btn">
                          删除订单
                        </div> -->
                                            <!-- 待消费 -->
                                            <template v-if="it.orderStatus=='3'">
                                                <!-- <div @click.stop="goUrl('pages/member/order/detail/main?orderno=' + it.id)" class="order-btn cancel-btn fl">
                            申请退款
                          </div> -->
                                                <div @click="goUrl('orderno=' + it.id)" class="order-btn red-btn fr">
                                                    查看详情
                                                </div>
                                            </template>
                                        </template>

                                        <!-- 门票 -->
                                        <template v-if="it.orderType=='park'">
                                            <!-- 已关闭 -->
                                            <!-- <div v-if="it.orderStatus=='5'" @click.stop="delOrder(it.orderNo)" class="order-btn cancel-btn">
                          删除订单
                        </div> -->
                                            <!-- 待消费 -->
                                            <template v-if="it.orderStatus=='3'">
                                                <!-- <div @click.stop="goUrl('pages/member/order/detail/main?orderno=' + it.id)" class="order-btn cancel-btn fl">
                            申请退款
                          </div> -->
                                                <div @click="goUrl('orderno=' + it.id)" class="order-btn red-btn fr">
                                                    查看详情
                                                </div>
                                            </template>
                                        </template>

                                        <!-- 商品 -->
                                        <template v-if="it.orderType=='mdse'">
                                            <!-- 已关闭 -->
                                            <!-- <div v-if="it.orderStatus=='5'" @click.stop="delOrder(it.orderNo)" class="order-btn cancel-btn">
                          删除订单
                        </div> -->
                                            <div v-if="it.orderStatus=='6'" @click.stop="refundgoUrl('orderno=' + it.orderNo+'&orderInfoId='+ it.id)" class="order-btn red-btn fr">
                                                退单详情
                                            </div>
                                            <!-- 已完成 -->
                                            <!-- <template v-if="it.orderStatus=='4'">
                          <div @click.stop="delOrder(it.orderNo)" class="order-btn cancel-btn">
                            发表评价
                          </div>
                          <div @click.stop="delOrder(it.orderNo)" class="order-btn cancel-btn">
                            查看二维码
                          </div>
                        </template> -->
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="no-data" v-else>暂无数据</div>
                </scroll>
            </swiper-item>
        </swiper>
        <div>
            <div v-html="formStr"></div>
        </div>
        <pay ref="pay" :totalprice="payMoney" :isWxPay="isWxPay"></pay>
        <vue-tab-bar v-if='bottomShow' :pageData='navigationData' @fetch-index="clickIndexNav" :selectNavIndex='selectNavIndex'></vue-tab-bar>
    </div>
</template>

<script>
import { isWxAli } from "@/common/common";
import { Swiper, SwiperItem } from "vux";
import scroll from "@/components/BScroll";
import pay from "../../service/order/public/pay";
import vueTabBar from "@/components/custompage/customComponent/vueTabBar"; //底部导航
export default {
  components: {
    Swiper,
    SwiperItem,
    vueTabBar,
    scroll,
    pay
  },
  data() {
    return {
        isWxPay: false,
      payType: "",
      formStr: "",
      pullup: true,
      bottomShow: false,
      pageShow: true, //去除个人中心过来的过度效果
      isShow: true,
      activestate: "all",
      listData: [[], [], [], [], []],
      pageLimt: [null, null, null, null, null], //初始化页面页数限制
      currentindex: 0,
      pageList: [1, 1, 1, 1, 1],
      swiperHeight: null,
      payMoney: null,
      payOrderNo: null,
      orderDescription: null,
      payIndex: null,
      isSwitch: false, //是否个人中心跳转过来,保证不会触发switch中的getList
      navigationData: {},
      selectNavIndex: 1,
      tabContentHeight:0
    };
  },
  //   created() {

  //   },
  created() {
    this.getAxios(this.api.aiPapi.getUsePage, {
      pageType: "navigationPage",
      useRange: "small"
    }).then(res => {
      // console.log(res);

      this.navigationData = JSON.parse(res.data.content);
      this.navigationData.range.map(item=>{
          if(item=='orderpage'){
              this.bottomShow = true;
              this.tabContentHeight=69
          }
      })
    });
    document.title="订单列表"
    this.swiperHeight = window.innerHeight - 39 + "px";

    let stateIndex = {
      all: 0,
      WAIT_PAY: 1,
      WAIT_CONSUME: 2,
      FINISH: 3,
      REFUNDING: 4
    };
    if (this.$route.query.name) {
      let name = this.$route.query.name;
      let num = stateIndex[this.$route.query.name];
      this.getList(name, num);
    } else {
      this.initData(); //第一次加载的时候，应该是请求并且展示全部
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.swiper.xheight = this.swiperHeight;
    });
    //用pageLimit看下原先数据是否请求过
    // console.log(this.$root.$mp.query);
    let state = ["", "0", "3", "4", "6"];
    this.pageLimt.forEach((item, index) => {
      if (item || item == 0) {
        this.stateGetList(state[index], index);
      }
    });
    let statestr = localStorage.getItem("wxxjsc_orderstate_2019_9_18");
    let stateIndex = {
      all: 0,
      WAIT_PAY: 1,
      WAIT_CONSUME: 2,
      FINISH: 3,
      REFUNDING: 4
    };
    if (statestr) {
      //有状态，订单中心跳转过来-页面展示，并且需要请求数据
      // 1、页面展示
      let _this = this;
      this.isSwitch = true;
      this.pageShow = false;
      this.activestate = statestr;
      this.currentindex = stateIndex[statestr];
      setTimeout(function() {
        _this.pageShow = true;
      }, 700);
      //2、请求借口，可能存在重复请求的问题，暂时不处理
      this.stateGetList(state[stateIndex[statestr]], stateIndex[statestr]);
      //清除缓存
      localStorage.removeItem("wxxjsc_orderstate_2019_9_18");
    }
  },
  methods: {
    stateGetList(state, index) {
      // console.log("stateGetList");

      let url = this.api.member.order.pagelist;
      let data = {
        currPage: 1,
        pageSize: 10 * this.pageList[index],
        orderStatus: state
      };
      if (state == "0") {
        //待付款状态的时候
        url = this.api.member.order.waitPayList;
        data = {
          leaguerId: localStorage.getItem("xjsc_login_userId_2019_3_8"),
          currPage: 1,
          pageSize: 10 * this.pageList[index],
          payStatus: 0
        };
      }
      this.getAxios(url, data, false).then(res => {
        if (this.pageList[index] == 1) {
          //当pagesize为10的时候去设置this.pageLimt[index]的最大页码数
          this.pageLimt[index] = res.data.pages;
        }
        res.data.rows.forEach((item, index) => {
          let stateName = "";
          if (item.orderStatus == "0") {
            stateName = "待付款";
          } else if (item.orderStatus == "1") {
            stateName = "待发货";
          } else if (item.orderStatus == "2") {
            stateName = "待收货";
          } else if (item.orderStatus == "3") {
            stateName = "待消费";
          } else if (item.orderStatus == "4") {
            stateName = "已完成";
          } else if (item.orderStatus == "5") {
            stateName = "已关闭";
          } else if (item.orderStatus == "6") {
            stateName = "退款中";
          } else if (item.orderStatus == "7") {
            stateName = "已退款";
          } else if (item.orderStatus == "8") {
            stateName = "订单异常";
          } else if (item.orderStatus == "9") {
            stateName = "订单待确认";
          }
          let arr = [];
          if (state == "0") {
            // 待付款
            // 规格信息处理
            if (item.orderDetailVoList[0].orderType == "mdse") {
              //地付款商品规格处理
              item.orderDetailVoList.forEach((specItem, specIndex) => {
                res.data.rows[index].orderDetailVoList[
                  specIndex
                ].specArr = this.formatterSpec(specItem.specParam);
              });
            }
            if (item.orderDetailVoList[0].orderType == "park") {
              //门票
              item.orderDetailVoList.forEach((specItem, specIndex) => {
                res.data.rows[index].orderDetailVoList[
                  specIndex
                ].startTime = specItem.startDate
                  ? specItem.startDate.split(" ")[0]
                  : "";
              });
            }
            if (item.orderDetailVoList[0].orderType == "hotel") {
              //酒店
              item.orderDetailVoList.forEach((specItem, specIndex) => {
                res.data.rows[index].orderDetailVoList[
                  specIndex
                ].startTime = specItem.startDate
                  ? specItem.startDate.split(" ")[0]
                  : "";
                res.data.rows[index].orderDetailVoList[
                  specIndex
                ].endTime = specItem.endDate
                  ? specItem.endDate.split(" ")[0]
                  : "";
              });
              console.log(res.data.rows);
            }
          } else {
            //非待付款
            if (item.orderType == "mdse") {
              //商品sku处理
              res.data.rows[index].specArr = this.formatterSpec(item.specParam);
            }
          }

          res.data.rows[index].stateName = stateName;
          // res.data.rows[index].hide = false;
          res.data.rows[index].startTime = item.startTime
            ? item.startTime.split(" ")[0]
            : "";
          res.data.rows[index].endTime = item.endTime
            ? item.endTime.split(" ")[0]
            : "";
        });
        this.$set(this.listData, index, res.data.rows);
      });
    },
    formatterSpec(str) {
      //{"重量":"500g"},{"多少抽":"100抽"},{"颜色":"纯白"}
      var arr = [];
      str.split(",").forEach((item, index) => {
        arr.push(JSON.parse(item)[Object.keys(JSON.parse(item))[0]]);
      });
      return arr;
    },
    delOrder(orderno) {
      //删除订单
      this.getAxios(this.api.member.delOrder, {
        orderNo: orderno
      }).then(res => {
        //已关闭只要全部列表里有，所以要重新请求下

        this.getAxios(this.api.member.order.pagelist, {
          currPage: 1,
          pageSize: 10 * this.pageList[0],
          orderStatus: ""
        }).then(res => {
          this.$set(this.listData, 0, this.listData[0].concat(res.data.rows));
        });
      });
    },
    cancelRefund() {
      //取消退款
      this.getAxios(this.api.member.order.cancelRetreat, {
        orderRefundNo: this.refundData.refundNo,
        wayType: 22
      }).then(res => {
        if (res.status == 200) {
          this.$vux.toast.show({
            type: "success",
            text: "取消退款成功"
          });
        }
      });
    },
    openPaySure(paySum, payOrderNo, orderDescription, i) {
      this.payMoney = paySum;
      this.payOrderNo = payOrderNo;
      this.orderDescription = orderDescription;
      this.payIndex = i;
      let env = isWxAli();
      this.getAxios("/merchant/api/merchantPayType/getMerchantPayType", {
        businessType: env.isWx ? "WEIXIN" : env.isAliPay ? "ALI" : "WAP"
      }).then(res => {
        this.payType = JSON.parse(res.message)[0];
        //微信端获取openid
        if (env.isWx) {
          this.getAxios("/leaguer/api/userLeaguer/manage/leaguerInfo", {
            leaguerId: localStorage.getItem("xjsc_login_userId_2019_3_8")
          }).then(res => {
            this.openId = res.data.openId ? res.data.openId : "";
            this.openPay();
          });
        } else if (env.isAliPay) {
          //阿里
          this.openPay();
        } else {
          this.openPay();
        }
      });
    },
    // 支付宝支付
    openPay() {
      let extendParam = {
        orderInfo: this.orderDescription,
        redirectUrl: encodeURIComponent(window.location.href),
        openId: this.openId ? this.openId : ""
      };
      this.getAxios(this.api.main.pay.goPay, {
        accountId: this.$route.query.m_id,
        extendParamJson: JSON.stringify(extendParam),
        operateId: localStorage.getItem("xjsc_login_userId_2019_3_8"),
        payOrderNo: this.payOrderNo,
        paySum: this.payMoney,
        payType: this.payType,
        userType: "C",
        wayType: 1
      }).then(res => {
        let env = isWxAli();
        this.formStr = res.data;
        this.isWxPay = env.isWx;
        this.$refs.pay.aliPayShow = true;
      });
    },
    cancelOrder(payOrderNo, index) {
      //取消订单
      this.postAxios(this.api.member.order.cancel, {
        payOrderNo: payOrderNo,
        leaguerId: localStorage.getItem("xjsc_login_userId_2019_3_8")
      }).then(res => {
        this.stateGetList(0, 1);
        this.$vux.toast.show({
          type: "success",
          text: "订单取消成功"
        });
      });
    },
    getBottom(index) {
      //触底，页面已经请求过，并且有数据才能触底，直接判断当前页码和this.pageLimt[index]的大小比对
      this.pageList[index]++;
      if (this.pageList[index] <= this.pageLimt[index]) {
        // console.log(this.pageList);
        this.getList(this.activestate, index);
      }
    },
    getList(state, index) {
      // console.log("getList");
      if (state == "WAIT_CONSUME") {
        //待消费
        state = "3";
      } else if (state == "FINISH") {
        //已完成
        state = "4";
      } else if (state == "REFUNDING") {
        //售后
        state = "6";
      }
      let url = this.api.member.order.pagelist;
      let data = {
        currPage: this.pageList[index],
        pageSize: 10,
        orderStatus: state == "all" ? "" : state
      };
      if (state == "WAIT_PAY") {
        //待付款
        url = this.api.member.order.waitPayList;
        data = {
          leaguerId: localStorage.getItem("xjsc_login_userId_2019_3_8"),
          currPage: this.pageList[index],
          pageSize: 10,
          payStatus: 0
        };
      }

      this.getAxios(url, data).then(res => {
        this.pageLimt[index] = res.data.pages;

        res.data.rows.forEach((item, index) => {
          let stateName = "";
          if (item.orderStatus == "0") {
            stateName = "待付款";
          } else if (item.orderStatus == "1") {
            stateName = "待发货";
          } else if (item.orderStatus == "2") {
            stateName = "待收货";
          } else if (item.orderStatus == "3") {
            stateName = "待消费";
          } else if (item.orderStatus == "4") {
            stateName = "已完成";
          } else if (item.orderStatus == "5") {
            stateName = "已关闭";
          } else if (item.orderStatus == "6") {
            stateName = "退款中";
          } else if (item.orderStatus == "7") {
            stateName = "已退款";
          } else if (item.orderStatus == "8") {
            stateName = "订单异常";
          } else if (item.orderStatus == "9") {
            stateName = "订单待确认";
          }
          let arr = [];
          if (state == "WAIT_PAY") {
            // 待付款
            if (item.orderDetailVoList[0].orderType == "mdse") {
              //商品-待付款 购物车结算生成的待付款订单，没有分单，一个订单包含多个商品及对应的sku
              item.orderDetailVoList.forEach((specItem, specIndex) => {
                res.data.rows[index].orderDetailVoList[
                  specIndex
                ].specArr = this.formatterSpec(specItem.specParam);
              });
            }
            if (item.orderDetailVoList[0].orderType == "park") {
              //门票景区
              // res.data.rows[
              //   index
              // ].startTime = item.orderDetailVoList[0].startDate.split(" ")[0];
              // console.log(item);
              item.orderDetailVoList.forEach((specItem, specIndex) => {
                res.data.rows[index].orderDetailVoList[
                  specIndex
                ].startTime = specItem.startDate
                  ? specItem.startDate.split(" ")[0]
                  : "";
              });
            }
            if (item.orderDetailVoList[0].orderType == "hotel") {
              //酒店
              item.orderDetailVoList.forEach((specItem, specIndex) => {
                res.data.rows[index].orderDetailVoList[
                  specIndex
                ].startTime = specItem.startDate
                  ? specItem.startDate.split(" ")[0]
                  : "";
                res.data.rows[index].orderDetailVoList[
                  specIndex
                ].endTime = specItem.endDate
                  ? specItem.endDate.split(" ")[0]
                  : "";
              });
            }
          } else {
            //非待付款
            if (item.orderType == "mdse") {
              // 商品
              // item.specParam.split(",").forEach((item, index) => {
              //   arr.push(JSON.parse(item)[Object.keys(JSON.parse(item))[0]]);
              // });
              res.data.rows[index].specArr = this.formatterSpec(item.specParam);
            }
            //门票景区
            if (item.orderType == "park") {
              res.data.rows[index].startTime = item.startTime
                ? item.startTime.split(" ")[0]
                : "";
            }
            //酒店
            if (item.orderType == "hotel") {
              res.data.rows[index].startTime = item.startTime
                ? item.startTime.split(" ")[0]
                : "";
              res.data.rows[index].endTime = item.endTime
                ? item.endTime.split(" ")[0]
                : "";
            }
          }

          res.data.rows[index].stateName = stateName;
          res.data.rows[index].hide = false;
        });
        // console.log(res.data.rows);
        this.isShow = true;
        this.$set(
          this.listData,
          index,
          this.listData[index].concat(res.data.rows)
        );
      });
    },
    initData() {
      this.getList("", 0);
    },
    goUrl(item) {
      this.$router.push({ path: "/orderDetail?" + item });
    },
    refundgoUrl(item){
        this.$router.push({ path: "/refundDetail?" + item });
    },
    select(state, index) {
      // if (!this.listData[index].length) {
      //   this.isShow = false;
      //   this.getList(state, index);
      // }
      this.activestate = state;
      this.currentindex = index;
      //   console.log(this.currentindex)
      //   this.getList(state, index);
    },
    switchTab(index) {
      //确定swiper滚动是触摸发起的
      this.currentindex = index;

      if (index == 0) {
        this.activestate = "all";
      } else if (index == 1) {
        this.activestate = "WAIT_PAY";
      } else if (index == 2) {
        this.activestate = "WAIT_CONSUME";
      } else if (index == 3) {
        this.activestate = "FINISH";
      } else if (index == 4) {
        this.activestate = "REFUNDING";
      }
      if (index == 1) {
        //待付款状态
        this.isShow = false;
      }
      if (!this.listData[index].length && !this.isSwitch) {
        this.getList(this.activestate, index);
      } else {
        this.isShow = true;
      }
      this.isSwitch = false;
    },
    gotoGame(path) {
      this.reLaunchPageTo(this.router + path);
    }
  }
};
</script>

<style lang="scss">
.order-list {
  width: 100%;
  overflow: hidden;
  .topShadow {
    width: 100%;
    height: 0.5px;
    background-color: rgba(146, 144, 144, 0.2);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
  }
  .state-ul {
    display: flex;
    justify-content: space-around;
    font-size: 14px;
    color: #5c5c5c;
    font-family: PingFangSC-Regular, sans-serif;
    background-color: #fff;
    .state-li {
      .state-title {
        padding: 10px 6px;
      }
    }
    .state-li.active {
      color: #f05b47;
      position: relative;
    }
    .state-li.active::after {
      content: "";
      display: block;
      height: 2px;
      width: 100%;
      background: #f05b47;
      position: absolute;
      bottom: 0;
      border-radius: 1px;
    }
  }
  .state-content {
    // height: 100%;
    .content-item {
      height: 100%;
      .no-data {
        font-size: 14px;
        text-align: center;
        color: #413838;
        font-family: PingFangSC-Regular, sans-serif;
        padding: 25px 0;
      }
      .item-ul {
        background-color: #fff;
        .waitpay {
          padding: 0 15px;
          padding-top: 20px;
          padding-bottom: 14px;
          .orderdate {
            margin-bottom: 18px;
            font-size: 12px;
            color: #413838;
            font-family: PingFangSC-Regular, sans-serif;
            .text {
              margin-right: 8px;
            }
            .state {
              font-size: 14px;
              color: #f05b47;
            }
          }
          .waitpay-info {
            .waitpay-info-item {
              margin-bottom: 5px;
            }
            .img {
              height: 80px;
              width: 80px;
              float: left;
            }
            .info {
              margin-left: 92px;
              .info-text {
                font-size: 14px;
                color: #413838;
                font-family: PingFangSC-Regular, sans-serif;
                margin-bottom: 8px;
              }
              .spec-price {
                // display: flex;
                // justify-content: space-between;
                .spec-list {
                  line-height: 15px;
                  //   margin:5px 0;
                  .spec-item {
                    font-size: 11px;
                    color: #999999;
                    font-family: PingFangSC-Regular, sans-serif;
                    margin-right: 12px;
                  }
                }
                .spec-list {
                  width: 75%;
                }
                .price-info {
                  color: #5c5c5c;
                  font-family: PingFangSC-Regular, sans-serif;
                  .price {
                    font-size: 14px;
                  }
                  .num {
                    font-size: 15px;
                    .unit {
                      font-size: 12px;
                      margin-right: 6px;
                      margin-top: 3px;
                    }
                  }
                }
              }
            }
            .pay {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 20px;
              .pay-money {
                font-size: 14px;
                color: #f05b47;
                font-family: PingFangSC-Regular, sans-serif;
                .text {
                  color: #413838;
                  margin-right: 8px;
                }
              }
              .order-btn {
                text-align: center;
                height: 25.5px;
                line-height: 25.5px;
                padding: 0 9px;
                border-radius: 2px;
                font-size: 12px;
                font-family: PingFangSC-Regular, sans-serif;
              }
              .red-btn {
                background: #f05b47;
                color: #fff;
                margin-left: 15px;
              }
              .cancel-btn {
                color: #f05b47;
                border: 0.5px solid #f05b47;
                height: 23.5px;
                line-height: 23.5px;
              }
            }
          }
        }
        //全部订单
        .item-li {
          height: 108px;
          padding: 0 15px;
          padding-top: 20px;
          .img {
            padding-bottom: 20px;
            display: flex;
            justify-content: space-between;
            .item-img-box {
              display: flex;
              align-items: center;
              .state-img {
                margin-right: 8px;
                height: 25px;
                width: 25px;
                border-radius: 50%;
              }
              .title {
                font-size: 14px;
                color: #413838;
                font-family: PingFangSC-Regular, sans-serif;
              }
            }
            .item-text {
              font-size: 14px;
              color: #f05b47;
              font-family: PingFangSC-Regular, sans-serif;
            }
            .item-text.close {
              color: #413838;
            }
          }
          .name-price {
            padding-bottom: 8px;
            font-size: 14px;
            display: flex;
            justify-content: space-between;
            .name {
              color: #413838;
              font-family: PingFangSC-Regular, sans-serif;
              font-weight: 500;
            }
            .price {
              color: #5c5c5c;
              font-family: PingFangSC-Regular, sans-serif;
            }
          }
          .use-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .time {
              font-size: 12px;
              color: #5c5c5c;
              font-family: PingFangSC-Regular, sans-serif;
              .text {
                margin-right: 7px;
              }
            }
            .num-detail {
              display: flex;
              align-items: center;
              .num {
                font-size: 14px;
                color: #5c5c5c;
                font-family: PingFangSC-Regular, sans-serif;
              }
              .detail-look {
                font-size: 12px;
                color: #f16c5a;
                font-family: PingFangSC-Regular, sans-serif;
                height: 25.5px;
                border: 0.5px solid #f16c5a;
                border-radius: 2px;
                line-height: 25.5px;
                padding: 0 8px;
                margin-left: 24px;
              }
              .detail-look.close {
                color: #5c5c5c;
                border-color: #5c5c5c;
              }
            }
          }
        }
      }
    }
  }
}
</style>
