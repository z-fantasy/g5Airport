/*
*
Active:"1"
Address1:null
Address2:null
BirthdayDD:"1"
BirthdayMM:"1"
BirthdayYYYY:"1994"
Bonus:"0"
CircleId:"01"
Discount:"0"
EffectDate:"2018/05/07 22:47:18"
ExpiryDate:"2117/05/31 00:00:00"
Grade:"WXCD"
IdCardType:null
IsFreeze:"0"
IsThisCircle:"1"
JoinDate:"2018/05/07 22:47:18"
Mobile:"18669019679"
OpenCardMallId:"G5"
OpenId:"osMhn0y5igckIM5JOkewLC8C5mTc"
Postal:null
Remark:null
Sex:"F"
SurName:"李金蓉"
Telephone:null
VipCardNo:"105000015"
VipCode:"105000015"
VipEmail:null
VipId:null
* */
export class User {
  constructor({Active, Address1, Address2, BirthdayDD, BirthdayMM, BirthdayYYYY, Bonus, CircleId, Discount, EffectDate, ExpiryDate, Grade, IdCardType, IsFreeze, IsThisCircle, JoinDate, Mobile, OpenCardMallId, OpenId, Postal, Remark, Sex, SurName, Telephone, VipCardNo, VipCode, VipEmail, VipId, CharacterTitle, TicketNum, CarNumber, Group20, Sheng, Shi, Qu}) {
    this.id = VipId
    this.code = VipCode
    this.cardNo = VipCardNo
    this.name = SurName
    this.email = VipEmail
    this.mobile = Mobile
    this.sex = Sex
    this.cardType = IdCardType
    this.bonus = Bonus
    this.bornYear = BirthdayYYYY || ''
    this.bornMonth = BirthdayMM || ''
    this.bornDay = BirthdayDD || ''
    this.birthday = this.bornDay ? [this.bornYear, this.bornMonth, this.bornDay].join('/') : ''
    this.circleId = CircleId
    this.grade = Grade
    this.createTime = JoinDate
    this.validTime = EffectDate
    this.invalidTime = ExpiryDate
    this.freezing = IsFreeze
    this.inCircle = IsThisCircle
    this.postal = Postal
    this.remark = Remark
    this.openId = OpenId
    this.inWhiteList = Active
    this.mallId = OpenCardMallId
    this.address = Address1 || ''
    this.carNo = CarNumber || ''
    this.addressInfo = Group20 || ''
    this.provinceText = Sheng || ''
    this.cityText = Shi || ''
    this.areaText = Qu || ''
    // this.bigAddress = '广东省广州市越秀区'
    // 卡券数量
    this.cardCount = TicketNum || 0
    // 此处有问题，做一个默认值处理
    this.selectTags = (CharacterTitle && this.getSelectTags(CharacterTitle)) || '1,2'.split(',')
  }

  getSelectTags(tagStr) {
    return tagStr.split(',')
  }
}
