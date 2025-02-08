import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  private readonly breakpointObserver = inject(BreakpointObserver);

  private readonly layoutChanges = toSignal(
    this.breakpointObserver
      .observe(Object.values(Breakpoints))
      .pipe(map(({ breakpoints }) => breakpoints)),
  );

  // Web

  public readonly isWebPortrait = computed(
    () => this.layoutChanges()?.[Breakpoints.WebPortrait] ?? false,
  );

  public readonly isWebLandscape = computed(
    () => this.layoutChanges()?.[Breakpoints.WebLandscape] ?? false,
  );

  public readonly isWeb = computed(
    () => this.isWebPortrait() || this.isWebLandscape(),
  );

  // Handset

  public readonly isHandsetPortrait = computed(
    () => this.layoutChanges()?.[Breakpoints.HandsetPortrait] ?? false,
  );

  public readonly isHandsetLandscape = computed(
    () => this.layoutChanges()?.[Breakpoints.HandsetLandscape] ?? false,
  );

  public readonly isHandleset = computed(
    () => this.isHandsetPortrait() || this.isHandsetLandscape(),
  );

  // Tablet

  public readonly isTabletLandscape = computed(
    () => this.layoutChanges()?.[Breakpoints.TabletLandscape] ?? false,
  );

  public readonly isTabletPortrait = computed(
    () => this.layoutChanges()?.[Breakpoints.TabletPortrait] ?? false,
  );

  public readonly isTablet = computed(
    () => this.isTabletPortrait() || this.isTabletLandscape(),
  );

  // Sizes
  public readonly isXSmall = computed(
    () => this.layoutChanges()?.[Breakpoints.XSmall] ?? false,
  );

  public readonly isSmall = computed(
    () => this.layoutChanges()?.[Breakpoints.Small] ?? false,
  );

  public readonly isMedium = computed(
    () => this.layoutChanges()?.[Breakpoints.Medium] ?? false,
  );

  public readonly isLarge = computed(
    () => this.layoutChanges()?.[Breakpoints.Large] ?? false,
  );

  public readonly isXLarge = computed(
    () => this.layoutChanges()?.[Breakpoints.XLarge] ?? false,
  );

  // ... (outros breakpoints omitidos para brevidade)
}
