/** AEM block-owned UI template. No inline handlers or external assets. */
export const template = String.raw`<header class="app-header">
        <div class="brand">
          <div class="brand-symbol" aria-hidden="true"><span></span><span></span><span></span></div>
          <div class="brand-text">
            <strong>3B Dönüşüm Laboratuvarı</strong>
            <small>Geometrik dönüşümler • Canvas 2D • 4×4 matrisler</small>
          </div>
        </div>
        <span class="course-tag">Etkileşimli JavaScript Projesi</span>
      </header>

      <div class="layout">
        <aside class="controls-panel" aria-label="Dönüşüm kontrol paneli">
          <div class="panel-intro">
            <span class="eyebrow">KONTROL PANELİ</span>
            <h2 class="controls-title">Options <span> / Seçenekler</span></h2>
            <p>Değerleri girin ve dönüşümü uygulayarak 3B küpü inceleyin.</p>
          </div>

          <section class="tool-section" aria-labelledby="translation-title">
            <div class="section-heading"><span class="section-icon">↗</span><h2 id="translation-title">Öteleme <span>Translation</span></h2></div>
            <div class="field-grid three">
              <label class="numeric-field"><span>X</span><input type="number" id="tx" value="0" step="0.1" aria-label="Öteleme X" /></label>
              <label class="numeric-field"><span>Y</span><input type="number" id="ty" value="0" step="0.1" aria-label="Öteleme Y" /></label>
              <label class="numeric-field"><span>Z</span><input type="number" id="tz" value="0" step="0.1" aria-label="Öteleme Z" /></label>
            </div>
            <button class="action-button" id="translate-btn" type="button">Ötele <span aria-hidden="true">→</span></button>
          </section>

          <section class="tool-section" aria-labelledby="rotation-title">
            <div class="section-heading"><span class="section-icon">⟳</span><h2 id="rotation-title">Döndürme <span>Rotation</span></h2></div>
            <div class="field-caption">Açı (derece)</div>
            <div class="field-grid three">
              <label class="numeric-field"><span>X°</span><input type="number" id="rx" value="0" step="5" aria-label="X açısı" /></label>
              <label class="numeric-field"><span>Y°</span><input type="number" id="ry" value="0" step="5" aria-label="Y açısı" /></label>
              <label class="numeric-field"><span>Z°</span><input type="number" id="rz" value="0" step="5" aria-label="Z açısı" /></label>
            </div>
            <div class="checkbox-line">
              <label for="arbitrary"><input id="arbitrary" type="checkbox" /> <span>Özel dönme noktası kullan</span></label>
            </div>
            <div class="pivot-controls" id="pivot-controls">
              <div class="field-caption">Dönme noktası (dünya koordinatı)</div>
              <div class="field-grid three">
                <label class="numeric-field"><span>X</span><input type="number" id="px" value="0" step="0.1" aria-label="Dönme noktası X" disabled /></label>
                <label class="numeric-field"><span>Y</span><input type="number" id="py" value="0" step="0.1" aria-label="Dönme noktası Y" disabled /></label>
                <label class="numeric-field"><span>Z</span><input type="number" id="pz" value="0" step="0.1" aria-label="Dönme noktası Z" disabled /></label>
              </div>
            </div>
            <button class="action-button" id="rotate-btn" type="button">Döndür <span aria-hidden="true">→</span></button>
          </section>

          <section class="tool-section" aria-labelledby="scale-title">
            <div class="section-heading"><span class="section-icon">⤢</span><h2 id="scale-title">Ölçekleme <span>Scale</span></h2></div>
            <div class="field-grid three">
              <label class="numeric-field"><span>X</span><input type="number" id="sx" value="1" step="0.1" aria-label="Ölçek X" /></label>
              <label class="numeric-field"><span>Y</span><input type="number" id="sy" value="1" step="0.1" aria-label="Ölçek Y" /></label>
              <label class="numeric-field"><span>Z</span><input type="number" id="sz" value="1" step="0.1" aria-label="Ölçek Z" /></label>
            </div>
            <div class="checkbox-line"><label for="keep-ratio"><input id="keep-ratio" type="checkbox" /><span>Oranı koru (Keep Aspect Ratio)</span></label></div>
            <button class="action-button" id="scale-btn" type="button">Ölçekle <span aria-hidden="true">→</span></button>
          </section>

          <section class="tool-section" aria-labelledby="mirror-title">
            <div class="section-heading"><span class="section-icon">⇄</span><h2 id="mirror-title">Aynalama <span>Mirror</span></h2></div>
            <div class="inline-row">
              <div class="axis-chooser" role="radiogroup" aria-label="Aynalama ekseni">
                <label><input type="radio" name="mirror-axis" value="x" checked /><span>X</span></label>
                <label><input type="radio" name="mirror-axis" value="y" /><span>Y</span></label>
                <label><input type="radio" name="mirror-axis" value="z" /><span>Z</span></label>
              </div>
              <button class="secondary-button" id="mirror-btn" type="button">Aynala</button>
            </div>
          </section>

          <section class="tool-section" aria-labelledby="shear-title">
            <div class="section-heading"><span class="section-icon">▱</span><h2 id="shear-title">Kaydırma <span>Shear</span></h2></div>
            <div class="inline-row">
              <div class="axis-chooser" role="radiogroup" aria-label="Kaydırma ekseni">
                <label><input type="radio" name="shear-axis" value="x" checked /><span>X</span></label>
                <label><input type="radio" name="shear-axis" value="y" /><span>Y</span></label>
                <label><input type="radio" name="shear-axis" value="z" /><span>Z</span></label>
              </div>
              <button class="secondary-button" id="shear-btn" type="button">Kaydır</button>
            </div>
            <div class="field-caption minor">Kaydırma katsayıları (k₁, k₂)</div>
            <div class="field-grid two">
              <label class="numeric-field"><span>k₁</span><input type="number" id="sh1" value="0.5" step="0.1" aria-label="Birinci kaydırma katsayısı" /></label>
              <label class="numeric-field"><span>k₂</span><input type="number" id="sh2" value="0" step="0.1" aria-label="İkinci kaydırma katsayısı" /></label>
            </div>
            <small class="help-text" id="shear-explanation">X′ = X + k₁Y + k₂Z</small>
          </section>

          <section class="tool-section display-section" aria-label="Görünüm seçenekleri">
            <div class="section-heading"><span class="section-icon">◫</span><h2>Görünüm <span>Display</span></h2></div>
            <button class="setting-row" id="wireframe-btn" type="button" aria-pressed="false"><span>Tel kafes / Katı yüzey</span><span class="setting-value" id="wireframe-label">Katı yüzey</span></button>
            <button class="setting-row" id="projection-btn" type="button" aria-pressed="false"><span>Perspektif / Ortografik</span><span class="setting-value" id="projection-label">Perspektif</span></button>
            <button class="setting-row" id="axes-btn" type="button" aria-pressed="false"><span>Koordinat eksenleri</span><span class="setting-value" id="axes-label">Kapalı</span></button>
          </section>
          <button class="reset-button" id="reset-btn" type="button">↺ <span>Tümünü sıfırla</span></button>
        </aside>

        <div class="workspace">
          <section class="viewport-card" aria-label="3B görselleştirme">
            <div class="viewport-header">
              <div class="viewport-title"><span class="live-dot"></span><div><strong>3B Görünüm</strong><small>Fareyle döndür • Kaydırarak yakınlaştır</small></div></div>
              <div class="viewport-actions">
                <button class="icon-button" id="camera-reset-btn" type="button" title="Kamera görünümünü sıfırla" aria-label="Kamera görünümünü sıfırla">⟲</button>
                <button class="icon-button" id="snapshot-btn" type="button" title="PNG görüntüsü kaydet" aria-label="PNG görüntüsü kaydet">↓</button>
              </div>
            </div>
            <div class="canvas-container" id="canvas-container">
              <div class="canvas-hint"><span class="axis-key red"></span>X <span class="axis-key green"></span>Y <span class="axis-key blue"></span>Z</div>
              <span class="view-corner">INTERACTIVE 3D</span>
              <div class="canvas-status" id="canvas-status" role="status" aria-live="polite">Hazır • Küp başlangıç konumunda</div>
            </div>
          </section>

          <div class="bottom-grid">
            <section class="info-card matrix-card" aria-labelledby="matrix-title">
              <div class="card-heading"><div><span class="eyebrow">MATEMATİKSEL GÖSTERİM</span><h2 id="matrix-title">Dönüşüm Matrisi <span>4 × 4</span></h2></div><button class="small-button" id="copy-matrix-btn" type="button">Kopyala</button></div>
              <div class="matrix-wrapper"><span class="matrix-bracket left"></span><table id="matrix-table" aria-label="4'e 4 dönüşüm matrisi"><tbody></tbody></table><span class="matrix-bracket right"></span></div>
            </section>
            <section class="info-card history-card" aria-labelledby="history-title">
              <div class="card-heading"><div><span class="eyebrow">İŞLEM GEÇMİŞİ</span><h2 id="history-title">Son Dönüşümler</h2></div><button class="small-button" id="undo-btn" type="button" disabled>↶ Geri al</button></div>
              <ol id="history-list" class="history-list" aria-live="polite"><li class="empty-history">Henüz dönüşüm uygulanmadı.</li></ol>
            </section>
          </div>
          <p class="footer-note">Tüm işlemler 4 × 4 homojen dönüşüm matrisleriyle gerçekleştirilir. Dönüşümler birikimli uygulanır ve dünya koordinat sistemini temel alır.</p>
        </div>
      </div>`;
