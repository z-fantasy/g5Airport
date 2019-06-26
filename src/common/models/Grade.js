export class Grade {
  constructor({XF_GRADE, XF_DESCI, EB_GRADE_IMG}) {
    this.id = XF_GRADE
    this.name = XF_DESCI
    this.img = EB_GRADE_IMG
  }
}
