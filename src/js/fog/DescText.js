const THREE = require('three');
export default class TathvaText {
    create_text(font) {
        var geometry = new THREE.TextGeometry(
            "What started out as the brainchild\n"+
            "of a few curious minds, is now an\n" +
            "emotion carried by those in and out\n"+
            "of the college.\n" +
            "Designate yourself as the supporter \n"+
            "of this techno-managerial festival", {
                font: font,
                size: Math.log(innerWidth) * 4.0 + 2.0,
                height: 0,
                bevelEnabled: false,
                curveSegments: 1
            });
        this.obj = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
            color: 0x333333
        }));

        var plane = new THREE.PlaneGeometry(1100, 700, 1, 1);
        this.bgObj = new THREE.Mesh(plane, new THREE.MeshBasicMaterial( {
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        }));
    }
}