import lodash from 'lodash';

class Period {
  static fromStringRepr = (stringRepr) => {
    const [year, periodScope] = stringRepr.split('-');
    const periodType = periodScope.split('')[0];

    return new Period(year, periodScope, periodType);
  }

  constructor (year, periodScope, periodType) {
    this._stringRepr = `${year}-${periodScope}`;
    this._year = year;
    this._periodScope = periodScope;
    this._periodType = periodType === 'Y'
      ? 'Year'
      : periodType;
  }

  get year () {
    return this._year;
  }

  get stringRepr () {
    return this._stringRepr;
  }

  get periodScope () {
    return this._periodScope;
  }

  get periodType () {
    return this._periodType;
  }

  toString () {
    if (this._periodType === 'Year') {
      return this._year;
    }
    return `${this._year} ${this._periodScope}`
  }
}

export default Period;
