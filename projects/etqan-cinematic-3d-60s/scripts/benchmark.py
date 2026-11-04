import bpy,math,time,os
from mathutils import Vector
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
s=bpy.context.scene;s.render.engine='BLENDER_EEVEE_NEXT';s.eevee.taa_render_samples=16
s.render.resolution_x=540;s.render.resolution_y=960;s.render.resolution_percentage=100
s.render.image_settings.file_format='PNG';s.render.filepath=os.path.abspath('work/qa/benchmark.png')
s.world.color=(.18,.22,.3)
s.world.use_nodes=True;s.world.node_tree.nodes['Background'].inputs[0].default_value=(.14,.19,.27,1);s.world.node_tree.nodes['Background'].inputs[1].default_value=.5
s.view_settings.view_transform='AgX'
def mat(n,c,metal,rough):
 m=bpy.data.materials.new(n);m.diffuse_color=(*c,1);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*c,1);p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough;return m
steel=mat('Steel',(.4,.5,.6),.85,.23);navy=mat('Navy',(.015,.03,.06),.4,.3);gold=mat('Gold',(.9,.6,.03),.8,.2)
for loc,r,d,m in [((0,0,1),.6,2,steel),((0,0,2.1),.8,.2,gold),((0,0,.1),1.1,.2,navy)]:
 bpy.ops.mesh.primitive_cylinder_add(vertices=64,radius=r,depth=d,location=loc);o=bpy.context.object;o.data.materials.append(m);be=o.modifiers.new('Machined bevel','BEVEL');be.width=.04;be.segments=3;o.modifiers.new('Normals','WEIGHTED_NORMAL')
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.03));bpy.context.object.data.materials.append(navy)
for loc,power,col,size in [((4,-4,6),1800,(1,.8,.55),5),((-4,2,4),2200,(.2,.5,1),4),((0,3,7),2200,(1,1,1),3)]:
 bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.data.energy=power;o.data.color=col;o.data.shape='DISK';o.data.size=size;o.rotation_euler=(Vector((0,0,1))-o.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=(4,-7,3.8));cam=bpy.context.object;cam.rotation_euler=(Vector((0,0,1))-cam.location).to_track_quat('-Z','Y').to_euler();s.camera=cam;cam.data.lens=65
start=time.time();bpy.ops.render.render(write_still=True);print('BENCHMARK_RENDER_SECONDS',time.time()-start)
