import {  TreeComponent,TreeNode, TREE_ACTIONS, KEYS, IActionMapping} from 'angular2-tree-component';
import {Component, ViewChild,OnInit} from '@angular/core';
import { Headers, Http, RequestMethod } from "@angular/http";

import {treeNode} from "../algorithmPara"
import * as _ from 'lodash';

const actionMapping:IActionMapping = {
  mouse: {
    // // dblClick: (tree, node, $event) =>{
    // //     $("#nameId").val(node.data.name);
    // //     console.log(node.data.name);
    // },
    click: TREE_ACTIONS.TOGGLE_SELECTED,


  },
  // keys: {
  //     [KEYS.ENTER]: (tree, node, $event) =>
  //         alert(`This is ${node.data.name}`)
  // }
}
@Component({
  selector: 'app-upload-management',
  templateUrl: './upload-management.component.html',
  styleUrls: ['./upload-management.component.sass']
})
export class UploadManagementComponent implements OnInit {

  public nodeName:string;
  public nodeIsHidden:boolean=false;
  public nodes:treeNode[]=[];
  public node;//node parameter
  public nodeId;
  public  dataUrl="http://10.5.0.222:8080/workflow/category/";
  public nodeEdit:TreeNode;//暂存编辑节点的数据
  public isEdit:boolean=false;
  formData = new FormData();
  constructor(private http: Http) {
    this.getData();

  }
  ngOnInit(){
    console.log("OnInit-upload-management");
  }
  // nodes = [
  //     // {
  //     //     id: 1,
  //     //     name: 'root1',
  //     //     isHidden:false,
  //     //     children: [
  //     //         { id: 2, name: 'child1' ,isHidden:false,children:[]},
  //     //         { id: 3, name: 'child2' ,isHidden:false,children:[]},
  //     //         { id: 8, name: 'child3' ,isHidden:false,children:[]},
  //     //     ]
  //     // },
  //     {
  //         id: 4,
  //         name: 'root2',
  //         isHidden:false,
  //         children: [
  //             { id: 5, name: 'child2.1' ,isHidden:false,
  //               children:[
  //                 { id: 91, name: 'subsub',isHidden:false,children:[]},
  //                 { id: 901, name: 'subsub',isHidden:false,children:[]}
  //               ]},
  //             {
  //                 id: 6,
  //                 name: 'child2.2',
  //                 isHidden:false,
  //                 children: [
  //                     { id: 71, name: 'subsub',isHidden:false,children:[]},
  //                     { id: 801, name: 'subsub',isHidden:false,children:[]}
  //                 ]
  //             }
  //         ]
  //     }
  // ];

  @ViewChild(TreeComponent)
  private tree :TreeComponent;

  treeOptions = {
    actionMapping,
    isHiddenField: 'hidden' ,//控制节点是否隐藏的属性，此处选择hidden非ishidden

  }
  onEvent = ($event) => {
    // this.isShow=false;
    // console.log("onEvent");
    // let value=$event.node.data.name;
    // $("#nameId").val(value);

  }

  save(){//add node save function
    if($("#nameId").val()==='') {
      alert("名称不能为空！！！");
    }
    else {
      this.nodeId=this.selectMaxId(this.nodes[0])+1;
      console.log(this.nodeId);
      this.node.data.children.push(
        {id: this.nodeId, name: this.nodeName, isHidden: this.nodeIsHidden, children: []});
      console.log(this.nodeId);
      this.nodeId++;
      if(this.nodeIsHidden){document.getElementById("treeSpan").style.color="#ff0000";console.log("clasname");}
      this.tree.treeModel.update();
      this.sendData();

      //$('#myModal').modal('hide');//model待完善
      // $('#myModal').on('hidden.bs.modal', function (e) {
      //     // do something...
      //     console.log("zhaoli");
      // })


    }
  }

  cancel(){ //add node form cancel function
    this.isEdit=false;
  }

  addNode(id:any){
    this.isEdit=false;
    $("#nameId").val("");//set input is null
    //this.isShow=false;
    this.node=this.tree.treeModel.getNodeById(id);
    // console.log(this.nodeToAdd);
    // for(var i=0;i<5;i++)//test data--delete
    // {
    //     console.log(nodeToAdd.children[i].id);
    //     console.log(nodeToAdd.children[i].data.name);
    //
    // }
  }
  remove(id:any){ //remove node
    console.log(id);
    let nodeToDelete=this.tree.treeModel.getNodeById(id);
    if(nodeToDelete.hasChildren){
      alert("该节点有子节点不能删除！！！");
    }
    else {
      if(nodeToDelete.isRoot){
        alert("此乃根节点不能删除！！！");
      }
      else{
        this.removeNode(nodeToDelete);
        this.tree.treeModel.update();
        this.sendData();
      }
      //this.sendDeleteNode(nodeToDelete);
    }
  }

  selected(){

    if ($("input:radio:checked").val()=="是"){
      this.nodeIsHidden=false;
      console.log("yes");
    }
    else {
      this.nodeIsHidden=true;
      console.log("no");
    }
  }

  getData(){//获取数据
    return this.http.get(this.dataUrl).toPromise().then(response=>{
      this.nodes.push(response.json());
      this.tree.treeModel.update();
      console.log(this.selectMaxId(this.nodes[0]));
      console.log("getData");
      console.log(this.nodes);
    })
      .catch(this.handleError);
  }

  selectMaxId(node:treeNode){//获取数组中最大的id
    let tempID=node.id;
    let len=node.children.length;
        if (len == 0) {
          return tempID;
        }
        else {
          for(let i=0;i<len;i++){
            if(tempID<this.selectMaxId(node.children[i])){
              tempID=this.selectMaxId(node.children[i]);
            }
          }
          return tempID;
        }

  }
  sendData(){//发送数据
    let headers = new Headers({'Content-Type': 'application/json'});
    console.log("senddata");
    console.log(this.nodes);
    return this.http.post(this.dataUrl,this.nodes,{ headers: headers, method: RequestMethod.Post }).toPromise()
      .then(response => {
        console.log(response);
        return (response.json());})
      .catch(this.handleError);
  }
  private handleError(error: any) {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
  removeNode(node: TreeNode) {//点击删除按钮删除节点
    let parentNode = node.realParent
      ? node.realParent
      : node.treeModel.virtualRoot;

    _.remove(parentNode.data.children, function(child) {
      return child === node.data;
    });
  }

  sendDeleteNode(node:TreeNode){//只传送删除的节点
    console.log(node);
    let deleteUrl="";
    let headers = new Headers({'Content-Type': 'application/json'});;
    return this.http.post(deleteUrl,node,{ headers: headers, method: RequestMethod.Post }).toPromise()
      .then(response => {
        console.log(response);
        return (response.json());})
      .catch(this.handleError);

  }

  editNode(node:TreeNode){
    this.isEdit=true;
    this.nodeEdit=node;
    $("#nameId").val(this.nodeEdit.data.name);
    if(this.nodeEdit.data.isHidden){
      $("input:radio[name='show']").eq(1).prop("checked","checked");//设置radio的选中值
    }
    else{
      $("input:radio[name='show']").eq(0).prop("checked","checked");
    }
  }
  editSave(){
    this.nodeEdit.data.name=$("#nameId").val();
    if($("input:radio:checked").val()=="是") {
      this.nodeEdit.data.isHidden=false;
    }
    else {
      this.nodeEdit.data.isHidden=true;
    }

    this.sendData();
  }
  changeListener(event): void {
        this.postImage(event.target);
     }

  postImage(inputValue: any): void {//上传图片
      this.formData.append("image", inputValue.files[0]);
     console.log(this.formData);
      var URL_Image = `>>>>>>>>>>>>>>>>>`;
      console.log(URL_Image);
      var xhr = new XMLHttpRequest();
      xhr.open("POST", URL_Image, true);
      xhr.send(this.formData);
      console.log(this.formData);
      xhr.onload = function (e) {
           if (this.status == 200) {
                alert(this.responseText);
              }
          }
      }
}
