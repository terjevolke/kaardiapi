import { createApp, watch } from "vue";
import { useStorage } from "@vueuse/core";

//  import VueGoogleMaps from "@fawmi/vue-google-maps";

// console.log(VueGoogleMaps);

const app = createApp({
  setup() {
    const empty = {
      lat: undefined,
      lon: undefined,
      title: undefined,
      description: undefined,
    };
    const markers = useStorage("markers", []);
    const newMarker = useStorage("newMarker", empty);
    const editMarker = useStorage("editMarker", empty);

    function add() {
      markers.value = [...markers.value, newMarker.value];
      newMarker.value = empty;
    }

    function edit(i) {
      editMarker.value = markers.value[i];
    }

    function update(i) {
      markers.value[i] = editMarker.value;
      editMarker.value = empty;
    }

    function del(i) {
      delete markers.value[i];
      markers.value = markers.value.filter((marker) => marker);
    }

    let map = null;

    function initMap() {
      map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 58.25, lng: 22.49 },
        zoom: 5,
      });
    }
    window.initMap = initMap;

    watch(
      markers,
      () => {
        console.log("muutus");
        markers.value.forEach((m) => {
          new google.maps.Marker({
            map: map,
            position: { lat: m.lat, lng: m.lon },
          });
        });
      },
      { deep: true }
    );

    return { del, markers, newMarker, editMarker, add, edit, update };
  },
});

// app.use(VueGoogleMaps, {
//   load: {
//     key: "YOUR_API_KEY_COMES_HERE",
//     // language: 'de',
//   },
// });
app.mount("#app");

/*
let map;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 58.25, lng: 22.49 },
    zoom: 14,
  });
  let marker = new google.maps.Marker({
    map: map,
  });
  map.addListener("click", (e) => {
    console.log(e.latLng.toJSON());
    marker.setPosition(e.latLng);
    document.getElementById("input-lat").value = e.latLng.toJSON().lat;
    document.getElementById("input-lng").value = e.latLng.toJSON().lng;
  });
}
window.initMap = initMap;
*/
