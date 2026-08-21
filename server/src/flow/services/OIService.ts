import { OptionTick } from '../providers/IOptionsDataProvider';

export interface HeatmapCell {
  strike: number;
  callOI: number;
  putOI: number;
  callChange: number; // Placeholder for phase 1 (mock data doesn't have change yet)
  putChange: number;  // Placeholder for phase 1
  totalOI: number;
}

export class OIService {
  /**
   * Transforms the raw option chain into the Heatmap structure.
   */
  static getHeatmapData(chain: OptionTick[]): HeatmapCell[] {
    const strikeMap = new Map<number, HeatmapCell>();

    for (const tick of chain) {
      if (!strikeMap.has(tick.strikePrice)) {
        strikeMap.set(tick.strikePrice, {
          strike: tick.strikePrice,
          callOI: 0,
          putOI: 0,
          callChange: 0,
          putChange: 0,
          totalOI: 0,
        });
      }
      
      const cell = strikeMap.get(tick.strikePrice)!;
      
      if (tick.optionType === 'CE') {
        cell.callOI = tick.openInterest;
        cell.callChange = (tick as any).changeInOI || 0;
      } else {
        cell.putOI = tick.openInterest;
        cell.putChange = (tick as any).changeInOI || 0;
      }
      
      cell.totalOI = cell.callOI + cell.putOI;
    }

    return Array.from(strikeMap.values()).sort((a, b) => a.strike - b.strike);
  }
}
