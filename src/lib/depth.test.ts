// Pruebas unitarias (Vitest) de la lógica de profundidades y del barajado con semilla.
import { describe, expect, it } from "vitest";
import { bgFor, dailySeed, lightPercent, pressureAtm, seededShuffle, temperatureC, zoneAt } from "./depth";

describe("zonas", () => {
  it("asigna la zona correcta por profundidad", () => {
    expect(zoneAt(0).id).toBe("epipelagica");
    expect(zoneAt(199).id).toBe("epipelagica");
    expect(zoneAt(200).id).toBe("twilight");
    expect(zoneAt(1500).id).toBe("medianoche");
    expect(zoneAt(5000).id).toBe("abisal");
    expect(zoneAt(10935).id).toBe("hadal");
    expect(zoneAt(99999).id).toBe("hadal");
  });
});

describe("física simplificada", () => {
  it("presión ≈ 1 atm en superficie y > 1,000 atm en Challenger Deep", () => {
    expect(pressureAtm(0)).toBeCloseTo(1, 5);
    expect(pressureAtm(10935)).toBeGreaterThan(1000);
  });
  it("la luz cae a ≈ 1 % a 200 m y casi 0 a 1,000 m", () => {
    expect(lightPercent(0)).toBeCloseTo(100, 5);
    expect(lightPercent(200)).toBeCloseTo(1, 0);
    expect(lightPercent(1000)).toBeLessThan(0.0001);
  });
  it("la temperatura decrece con la profundidad", () => {
    expect(temperatureC(0)).toBeGreaterThan(temperatureC(1000));
    expect(temperatureC(1000)).toBeGreaterThan(temperatureC(4000));
  });
  it("el gradiente de fondo devuelve t entre 0 y 100", () => {
    for (const d of [0, 100, 400, 3000, 7000, 11000]) {
      const { t } = bgFor(d);
      expect(t).toBeGreaterThanOrEqual(0);
      expect(t).toBeLessThanOrEqual(100);
    }
  });
});

describe("barajado con semilla", () => {
  const base = [1, 2, 3, 4, 5, 6, 7, 8];
  it("es determinista", () => {
    expect(seededShuffle(base, 20240101)).toEqual(seededShuffle(base, 20240101));
  });
  it("conserva todos los elementos y no muta el original", () => {
    const out = seededShuffle(base, 7);
    expect([...out].sort()).toEqual(base);
    expect(base).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });
  it("semillas distintas suelen dar órdenes distintos", () => {
    expect(seededShuffle(base, 1)).not.toEqual(seededShuffle(base, 2));
  });
  it("dailySeed produce AAAAMMDD", () => {
    expect(dailySeed(new Date(2025, 0, 9))).toBe(20250109);
  });
});
