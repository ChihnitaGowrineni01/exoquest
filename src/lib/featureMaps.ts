export type ModelKey = 'kepler' | 'k2' | 'tess';
type ColInfo = { description: string; type: 'float' | 'int' | 'string' };

export const FEATURE_MAP: Record<ModelKey, Record<string, ColInfo>> = {
  kepler: {
    koi_period:   { description: 'Orbital period (days)', type: 'float' },
    koi_duration: { description: 'Transit duration (hours)', type: 'float' },
    koi_depth:    { description: 'Transit depth (ppm)', type: 'float' },
    koi_prad:     { description: 'Planet radius (R⊕)', type: 'float' },
    koi_teq:      { description: 'Equilibrium temperature (K)', type: 'float' },
    koi_insol:    { description: 'Insolation flux (⊕)', type: 'float' },
  },
  k2: {
    // fill with your K2 columns
  },
  tess: {
    st_pmra: { description: 'Star motion east–west', type: 'float' },
    st_pmdec:{ description: 'Star motion north–south', type: 'float' },
    pl_orbper:{ description: 'Planet orbital period (days)', type: 'float' },
    pl_trandurh:{ description: 'Transit duration (hours)', type: 'float' },
    pl_trandep:{ description: 'Transit depth (ppm)', type: 'float' },
    pl_rade:{ description: 'Planet radius (R⊕)', type: 'float' },
    pl_insol:{ description: 'Starlight received (⊕)', type: 'float' },
    pl_eqt:{ description: 'Equilibrium temperature (K)', type: 'float' },
    st_tmag:{ description: 'TESS magnitude', type: 'float' },
    st_dist:{ description: 'Distance (pc)', type: 'float' },
    st_teff:{ description: 'Star effective temperature (K)', type: 'float' },
    st_logg:{ description: 'Surface gravity (log g)', type: 'float' },
    st_rad:{ description: 'Star radius (R☉)', type: 'float' },
    pl_pnum:{ description: 'Number of planet candidates', type: 'int' },
  },
};

export const FEATURE_ORDER: Record<ModelKey, string[]> = {
  kepler: ['koi_period','koi_duration','koi_depth','koi_prad','koi_teq','koi_insol'],
  k2:     [],
  tess:   ['st_pmra','st_pmdec','pl_orbper','pl_trandurh','pl_trandep','pl_rade','pl_insol','pl_eqt','st_tmag','st_dist','st_teff','st_logg','st_rad','pl_pnum'],
};
