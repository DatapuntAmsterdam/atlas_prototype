/**
 * @ngdoc overview
 * @name atlas.module:atlas
 * @description
 *
 * The main module for the atlas application. This module contains the controllers
 * used through the app, as well as all reducers.
 * <table>
 * <tr><th>URL parameter        </th><th>State variable                   </th><th>hasDefaultValue         </th></tr>
 * <tr><td> zoek                </td><td> search.query or search.location </td><td> no, null               </td></tr>
 * <tr><td> lat                 </td><td> map.viewCenter[0]               </td><td> yes, see DEFAULT_STATE </td></tr>
 * <tr><td> lon                 </td><td> map.viewCenter[1]               </td><td> yes, see DEFAULT_STATE </td></tr>
 * <tr><td> basiskaart          </td><td> map.baseLayer                   </td><td> yes, see DEFAULT_STATE </td></tr>
 * <tr><td> lagen               </td><td> map.overlays                    </td><td> no, []                 </td></tr>
 * <tr><td> zoom                </td><td> map.zoom                        </td><td> yes, see DEFAULT_STATE </td></tr>
 * <tr><td> selectie            </td><td> map.highlight                   </td><td> no, null               </td></tr>
 * <tr><td> kaartlagen-selectie </td><td> map.showLayerSelection          </td><td> false                  </td></tr>
 * <tr><td> actieve-kaartlagen  </td><td> map.showActiveOverlays          </td><td> false                  </td></tr>
 * <tr><td> volledig-scherm     </td><td> map.isFullScreen                </td><td> false                  </td></tr>
 * <tr><td>                     </td><td> map.isLoading                   </td><td> no                     </td></tr>
 * <tr><td> pagina              </td><td> page                            </td><td> yes, see DEFAULT_STATE </td></tr>
 * <tr><td> detail              </td><td> detail.uri                      </td><td> no, detail is null     </td></tr>
 * <tr><td>                     </td><td> detail.isLoading                </td><td> no, detail is null     </td></tr>
 * <tr><td> id                  </td><td> straatbeeld.id                  </td><td> no                     </td></tr>
 * <tr><td> plat                </td><td> straatbeeld.searchLocation[0]   </td><td> no                     </td></tr>
 * <tr><td> plon                </td><td> straatbeeld.searchLocation[1]   </td><td> no                     </td></tr>
 * <tr><td>                     </td><td> straatbeeld.date                </td><td> no                     </td></tr>
 * <tr><td>                     </td><td> straatbeeld.camera.location     </td><td> no                     </td></tr>
 * <tr><td> heading             </td><td> straatbeeld.camera.heading      </td><td> no                     </td></tr>
 * <tr><td> pitch               </td><td> straatbeeld.camera.pitch        </td><td> no                     </td></tr>
 * <tr><td> fov                 </td><td> straatbeeld.camera.fov          </td><td> no                     </td></tr>
 * <tr><td>                     </td><td> straatbeeld.hotspots            </td><td> no, []                 </td></tr>
 * <tr><td>                     </td><td> straatbeeld.isLoading           </td><td> no                     </td></tr>
 * </table>
*/
(function () {
    'use strict';

    angular
        .module('atlas', [
            'atlasHeader',
            'atlasPage',
            'atlasDetail',
            'atlasSearchResults',
            'atlasLayerSelection',
            'dpMap',
            'dpStraatbeeld',
            'dpDataSelection',

            'dpShared'
        ]);
})();