/**
 * Описывает политику (правило) выдачи купонов.
 */
export interface CouponPolicy {
  /**
   * "Цена" одного купона в очках.
   */
  priceInScore: number;
}
